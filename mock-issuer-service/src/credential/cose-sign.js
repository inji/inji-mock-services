import * as cbor from "cbor-x";
import { sign } from "node:crypto";

const encoder = new cbor.Encoder({
  useRecords: false,
  useTag259ForMaps: false,
  variableMapSize: true,
});

export function encodeCbor(value) {
  return Buffer.from(encoder.encode(value));
}

export function signCoseSign1({ protectedHeader, unprotectedHeader, payload, privateKey }) {
  const protectedBytes = encodeCbor(protectedHeader);
  const payloadBytes = Buffer.from(payload);
  const sigStructure = encodeCbor([
    "Signature1",
    protectedBytes,
    Buffer.alloc(0),
    payloadBytes,
  ]);
  const signature = sign("sha256", sigStructure, {
    key: privateKey,
    dsaEncoding: "ieee-p1363",
  });

  return [
    protectedBytes,
    unprotectedHeader ?? new Map(),
    payloadBytes,
    signature,
  ];
}
