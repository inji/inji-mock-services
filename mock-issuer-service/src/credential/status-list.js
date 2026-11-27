import * as cbor from "cbor-x";
import { deflateSync, inflateSync } from "node:zlib";
import { ISSUER } from "../issuer-profile.js";
import { encodeCbor, signCoseSign1 } from "./cose-sign.js";
import { getIssuerCredential } from "./issuer-cert.js";

// List 1 is bits = 2, so a credential can be valid, revoked, or suspended.
// Bits are packed from the least significant bit.
const STATUS_LISTS = {
  "1": { bits: 2, values: [0, 1, 2, 0] },
};

export const MDOC_STATUSES = {
  valid: { idx: 0, givenName: "Valid", documentNumber: "MDL-VALID" },
  revoked: { idx: 1, givenName: "Revoked", documentNumber: "MDL-REVOKED" },
  suspended: { idx: 2, givenName: "Suspended", documentNumber: "MDL-SUSPENDED" },
  // Index 3 is already status value 0 (VALID). Expiry comes from the mdoc
  // validity period, not from a status-list value.
  expired: { idx: 3, givenName: "Expired", documentNumber: "MDL-EXPIRED", credentialExpired: true },
};

export const MDOC_STATUS_OPTIONS = new Set(Object.keys(MDOC_STATUSES));

// Wallet catalog entries. MdocVerifiableCredential stays the valid card so the
// existing issuer selection still downloads a storable credential.
export const MDOC_CONFIG_STATUS = {
  MdocVerifiableCredential: "valid",
  MdocRevokedVerifiableCredential: "revoked",
  MdocSuspendedVerifiableCredential: "suspended",
  MdocExpiredVerifiableCredential: "expired",
};

export function resolveMdocStatus(value) {
  return MDOC_STATUSES[value] ? value : "valid";
}

export function statusForMdocRequest(configId, tokenStatus) {
  if (configId && configId !== "MdocVerifiableCredential" && MDOC_CONFIG_STATUS[configId]) {
    return MDOC_CONFIG_STATUS[configId];
  }
  if (tokenStatus) return resolveMdocStatus(tokenStatus);
  return MDOC_CONFIG_STATUS[configId] || "valid";
}

export function statusListUri(id = "1") {
  return `${ISSUER}/statuslists/${id}`;
}

export function resolveIssuedMdocStatus(configId, tokenStatus) {
  const status = statusForMdocRequest(configId, tokenStatus);
  return { ...MDOC_STATUSES[status], listId: "1" };
}

export function buildStatusBits(values = STATUS_LISTS["1"].values, bits = STATUS_LISTS["1"].bits) {
  const bytes = Buffer.alloc(Math.ceil((values.length * bits) / 8));
  values.forEach((value, index) => {
    const bitIndex = index * bits;
    const byteIndex = Math.floor(bitIndex / 8);
    const shift = bitIndex % 8;
    bytes[byteIndex] |= (value & ((1 << bits) - 1)) << shift;
  });
  return bytes;
}

export function createStatusListCwt(uri = statusListUri(), bits = STATUS_LISTS["1"].bits, values = STATUS_LISTS["1"].values) {
  const { privateKey, certificateDer } = getIssuerCredential();
  const issuedAt = Math.floor(Date.now() / 1000) - 5;
  const claims = new Map([
    [2, uri],
    [6, issuedAt],
    [4, issuedAt + 24 * 60 * 60],
    [65534, 3600],
    [65533, new Map([
      ["bits", bits],
      ["lst", deflateSync(buildStatusBits(values, bits))],
    ])],
  ]);

  // x5chain (33) is a single certificate byte string in the unprotected header.
  // The protected header carries alg and typ.
  const sign1 = signCoseSign1({
    protectedHeader: new Map([
      [1, -7],
      [16, "application/statuslist+cwt"],
    ]),
    unprotectedHeader: new Map([[33, certificateDer]]),
    payload: encodeCbor(claims),
    privateKey,
  });

  return encodeCbor(new cbor.Tag(sign1, 18));
}

export function readStatusBit(listBytes, index, bits = STATUS_LISTS["1"].bits) {
  const inflated = inflateSync(listBytes);
  const bitIndex = index * bits;
  const byteIndex = Math.floor(bitIndex / 8);
  const shift = bitIndex % 8;
  return (inflated[byteIndex] >> shift) & ((1 << bits) - 1);
}

export function statusListHandler(req, res) {
  const list = STATUS_LISTS[req.params.id];
  if (!list) {
    return res.status(404).type("text/plain").send("Unknown status list");
  }

  const uri = statusListUri(req.params.id);
  const token = createStatusListCwt(uri, list.bits, list.values);
  console.log(`Serving mDoc status list CWT at ${uri} bits=${list.bits} (${token.length} bytes)`);
  res.status(200);
  res.setHeader("Content-Type", "application/statuslist+cwt");
  res.setHeader("Cache-Control", "no-store");
  return res.end(token);
}
