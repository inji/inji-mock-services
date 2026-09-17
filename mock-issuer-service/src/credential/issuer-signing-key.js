// A long-lived issuer signing key for SD-JWT VCs whose `iss` is this issuer's HTTPS URL.
//
// A verifier resolves such a credential's key from JWT VC Issuer Metadata
// (draft-ietf-oauth-sd-jwt-vc, section 5): it fetches `/.well-known/jwt-vc-issuer`, and picks the
// key matching the JWT `kid` from the `jwks` published there. That only works if the key survives
// across requests, unlike the per-request keys the other formats use.

import { generateKeyPair, exportJWK, calculateJwkThumbprint } from "jose";
import { ISSUER } from "../issuer-profile.js";

export const SD_JWT_KEY_RESOLUTION_X5C = "x5c";
export const SD_JWT_KEY_RESOLUTION_ISSUER_METADATA = "issuer-metadata";

// x5c stays the default so existing flows are unchanged; set SD_JWT_KEY_RESOLUTION=issuer-metadata
// to issue credentials that can only be verified through the issuer metadata.
export const SD_JWT_KEY_RESOLUTION =
  (process.env.SD_JWT_KEY_RESOLUTION || SD_JWT_KEY_RESOLUTION_X5C).toLowerCase();

let signingKey;

export function issuerSigningKey() {
  if (!signingKey) {
    // Cache the promise so concurrent first requests share one key.
    signingKey = (async () => {
      const { privateKey, publicKey } = await generateKeyPair("ES256");
      const publicJwk = await exportJWK(publicKey);
      const kid = await calculateJwkThumbprint(publicJwk);
      return { privateKey, publicJwk: { ...publicJwk, kid, use: "sig", alg: "ES256" }, kid };
    })();
  }
  return signingKey;
}

/**
 * GET /.well-known/jwt-vc-issuer - JWT VC Issuer Metadata. `issuer` must equal the credential's
 * `iss` exactly, and the keys are inlined so a verifier needs a single fetch.
 */
export async function jwtVcIssuerMetadata(req, res) {
  const { publicJwk } = await issuerSigningKey();
  res.json({ issuer: ISSUER, jwks: { keys: [publicJwk] } });
}
