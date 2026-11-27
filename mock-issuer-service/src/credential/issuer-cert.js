import {
  X509Certificate,
  createPublicKey,
  generateKeyPairSync,
  randomBytes,
  sign,
} from "node:crypto";

const ECDSA_WITH_SHA256 = "2a8648ce3d040302";
const COUNTRY_NAME = "550406";
const ORGANIZATION_NAME = "55040a";
const COMMON_NAME = "550403";
const KEY_USAGE_OID = "551d0f";
const EXTENDED_KEY_USAGE_OID = "551d25";
// ISO 18013-5 document-signer EKU, used with digitalSignature key usage.
const MDL_DS_EKU = [1, 0, 18013, 5, 1, 2];

function derLength(length) {
  if (length < 0x80) return Buffer.from([length]);
  if (length <= 0xff) return Buffer.from([0x81, length]);
  return Buffer.from([0x82, (length >> 8) & 0xff, length & 0xff]);
}

function der(tag, content) {
  return Buffer.concat([Buffer.from([tag]), derLength(content.length), content]);
}

function sequence(parts) {
  return der(0x30, Buffer.concat(parts));
}

function integer(value) {
  let bytes = Buffer.from(value);
  if (bytes.length === 0) bytes = Buffer.from([0]);
  if (bytes[0] & 0x80) bytes = Buffer.concat([Buffer.from([0x00]), bytes]);

  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0x00 && (bytes[start + 1] & 0x80) === 0) {
    start += 1;
  }
  return der(0x02, bytes.subarray(start));
}

function bitString(payload) {
  return der(0x03, Buffer.concat([Buffer.from([0x00]), payload]));
}

function oid(hex) {
  return der(0x06, Buffer.from(hex, "hex"));
}

function encodeOid(parts) {
  const body = [parts[0] * 40 + parts[1]];
  for (const part of parts.slice(2)) {
    const chunk = [part & 0x7f];
    let value = part >> 7;
    while (value > 0) {
      chunk.push((value & 0x7f) | 0x80);
      value >>= 7;
    }
    body.push(...chunk.reverse());
  }
  return der(0x06, Buffer.from(body));
}

function booleanTrue() {
  return Buffer.from([0x01, 0x01, 0xff]);
}

function octetString(payload) {
  return der(0x04, payload);
}

function explicit(tagNumber, content) {
  return der(0xa0 | tagNumber, content);
}

function criticalExtension(oidValue, extnValue) {
  return sequence([oidValue, booleanTrue(), octetString(extnValue)]);
}

function printable(value) {
  return der(0x13, Buffer.from(value, "ascii"));
}

function utcTime(date) {
  const pad = (part) => String(part).padStart(2, "0");
  const text = [
    pad(date.getUTCFullYear() % 100),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
  ].join("") + "Z";
  return der(0x17, Buffer.from(text, "ascii"));
}

function attribute(oidHex, value) {
  return der(0x31, sequence([oid(oidHex), printable(value)]));
}

function distinguishedName(commonName) {
  // C=IN matches the mDL issuing_country claim used by this mock.
  return sequence([
    attribute(COUNTRY_NAME, "IN"),
    attribute(ORGANIZATION_NAME, "Mock Issuer"),
    attribute(COMMON_NAME, commonName),
  ]);
}

function issuerName() {
  return distinguishedName("Mock mDL Issuer");
}

function signatureAlgorithm() {
  return sequence([oid(ECDSA_WITH_SHA256)]);
}

function createIssuerCredential() {
  const { privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const spki = createPublicKey(privateKey).export({ type: "spki", format: "der" });
  const serial = randomBytes(8);
  serial[0] &= 0x7f;
  if (serial[0] === 0) serial[0] = 1;

  // Expired mDLs are signed about 400 days ago; notBefore must precede that
  // so the document-signer cert was already valid at signing time.
  const notBefore = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
  const notAfter = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
  const name = issuerName();
  // digitalSignature is bit 0. Unused-bits is 7 so the BIT STRING is DER-canonical.
  // The extension is critical, as ISO 18013-5 requires.
  const keyUsage = criticalExtension(oid(KEY_USAGE_OID), der(0x03, Buffer.from([0x07, 0x80])));
  const extendedKeyUsage = criticalExtension(
    oid(EXTENDED_KEY_USAGE_OID),
    sequence([encodeOid(MDL_DS_EKU)]),
  );
  const tbsCertificate = sequence([
    explicit(0, integer(Buffer.from([2]))),
    integer(serial),
    signatureAlgorithm(),
    name,
    sequence([utcTime(notBefore), utcTime(notAfter)]),
    name,
    spki,
    explicit(3, sequence([keyUsage, extendedKeyUsage])),
  ]);
  const signature = sign("sha256", tbsCertificate, { key: privateKey, dsaEncoding: "der" });
  const certificateDer = sequence([
    tbsCertificate,
    signatureAlgorithm(),
    bitString(signature),
  ]);

  const certificate = new X509Certificate(certificateDer);
  if (!certificate.verify(certificate.publicKey)) {
    throw new Error("Generated issuer certificate failed self-signature check");
  }
  if (!certificate.subject.includes("C=IN")) {
    throw new Error(`Issuer certificate subject is missing C=IN: ${certificate.subject}`);
  }
  // Node's certificate.keyUsage reports extended key usage OIDs, not the KU bits.
  const extendedKeyUsageOids = certificate.keyUsage ?? [];
  if (!extendedKeyUsageOids.includes(MDL_DS_EKU.join("."))) {
    throw new Error(`DS certificate is missing the mDL EKU: ${extendedKeyUsageOids}`);
  }
  if (!certificate.raw.includes(Buffer.from("0603551d0f0101ff040403020780", "hex"))) {
    throw new Error("DS certificate is missing critical digitalSignature key usage");
  }

  return {
    privateKey,
    certificateDer: Buffer.from(certificate.raw),
  };
}

let cachedCredential;

export function getIssuerCredential() {
  if (!cachedCredential) cachedCredential = createIssuerCredential();
  return cachedCredential;
}
