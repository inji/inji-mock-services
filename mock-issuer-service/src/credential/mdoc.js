import * as cbor from 'cbor-x';
import { createHash, randomBytes } from 'node:crypto';
import { encodeCbor, signCoseSign1 } from './cose-sign.js';
import { getIssuerCredential } from './issuer-cert.js';

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

function taggedDateTime(date) {
  // mDL validity times use whole seconds only (e.g. 2024-01-01T00:00:00Z), not milliseconds.
  const text = date.toISOString().replace(/\.\d{3}Z$/, "Z");
  return new cbor.Tag(text, 0);
}

function toCoseKey(publicKeyJwk) {
  return new Map([
    [1, 2], // kty: EC2
    [-1, 1], // crv: P-256
    [-2, Buffer.from(publicKeyJwk.x, 'base64url')],
    [-3, Buffer.from(publicKeyJwk.y, 'base64url')],
  ]);
}

export function createMdoc({ devicePublicKeyJwk, docType, namespaces, statusList, validity }) {
  const issuerSigned = {
    nameSpaces: {},
    issuerAuth: null
  };

  const valueDigests = {};

  for (const ns of Object.keys(namespaces)) {
    issuerSigned.nameSpaces[ns] = [];
    valueDigests[ns] = new Map();
    
    const nsClaims = namespaces[ns];
    let digestId = 0;
    
    for (const claim of Object.keys(nsClaims)) {
      const salt = randomBytes(16);
      
      const item = {
        digestID: digestId,
        random: salt,
        elementIdentifier: claim,
        elementValue: nsClaims[claim]
      };
      
      const encodedItem = encodeCbor(item);
      const taggedItem = new cbor.Tag(encodedItem, 24);
      issuerSigned.nameSpaces[ns].push(taggedItem);

      const digest = sha256(encodeCbor(taggedItem));
      valueDigests[ns].set(digestId, digest);
      
      digestId++;
    }
  }

  const signedAt = validity?.signed ? new Date(validity.signed) : new Date();
  const validFrom = validity?.validFrom ? new Date(validity.validFrom) : signedAt;
  const validUntil = validity?.validUntil
    ? new Date(validity.validUntil)
    : new Date(signedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

  const mso = {
    version: "1.0",
    digestAlgorithm: "SHA-256",
    valueDigests: valueDigests,
    deviceKeyInfo: {
      deviceKey: toCoseKey(devicePublicKeyJwk)
    },
    docType: docType,
    validityInfo: {
      signed: taggedDateTime(signedAt),
      validFrom: taggedDateTime(validFrom),
      validUntil: taggedDateTime(validUntil)
    }
  };

  if (statusList) {
    mso.status = {
      status_list: {
        idx: statusList.idx,
        uri: statusList.uri,
      },
    };
  }

  const { privateKey, certificateDer } = getIssuerCredential();
  const msoBytes = encodeCbor(mso);
  // issuerAuth is an untagged COSE_Sign1 array. x5chain (33) is a single
  // certificate byte string in the unprotected header.
  issuerSigned.issuerAuth = signCoseSign1({
    protectedHeader: new Map([[1, -7]]),
    unprotectedHeader: new Map([[33, certificateDer]]),
    payload: encodeCbor(new cbor.Tag(msoBytes, 24)),
    privateKey,
  });

  return encodeCbor({
    docType: docType,
    issuerSigned: issuerSigned
  });
}
