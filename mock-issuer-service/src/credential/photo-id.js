import { readFileSync } from 'node:fs';
import { createPublicKey } from 'node:crypto';
import { decodeProtectedHeader, importJWK, jwtVerify } from 'jose';

export const PHOTO_ID_DOCTYPE = 'org.iso.23220.photoid.1';
export const PHOTO_ID_NAMESPACE = 'org.iso.23220.1';

// Public sample portrait, distributed by OWF Multipaz under Apache-2.0.
const portrait = readFileSync(new URL('../../assets/erika-mustermann.jpg', import.meta.url));

export async function photoIdHolderKey(proofJwt) {
  const header = decodeProtectedHeader(proofJwt);
  const jwk = header.jwk ?? (header.kid?.startsWith('did:jwk:')
    ? JSON.parse(Buffer.from(header.kid.slice('did:jwk:'.length).split('#')[0], 'base64url').toString('utf8'))
    : undefined);
  if (!jwk || jwk.kty !== 'EC' || jwk.crv !== 'P-256' || !jwk.x || !jwk.y || jwk.d) {
    throw new Error('Photo ID requires a public P-256 holder JWK in proof.jwk or did:jwk kid');
  }
  createPublicKey({ key: jwk, format: 'jwk' });
  await jwtVerify(proofJwt, await importJWK(jwk, 'ES256'), { algorithms: ['ES256'] });
  return { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y };
}

export function photoIdClaims(now = new Date()) {
  const issueDate = now.toISOString().slice(0, 10);
  const expiryDate = new Date(now);
  expiryDate.setUTCFullYear(expiryDate.getUTCFullYear() + 1);
  return {
    [PHOTO_ID_NAMESPACE]: {
      given_name: 'Erika',
      family_name: 'Mustermann',
      given_name_unicode: 'Erika',
      family_name_unicode: 'Mustermann',
      birth_date: '1990-01-01',
      birthplace: 'Bengaluru',
      portrait,
      sex: 2,
      age_over_18: true,
      age_over_21: true,
      issue_date: issueDate,
      expiry_date: expiryDate.toISOString().slice(0, 10),
      issuing_country: 'IN',
      issuing_authority_unicode: 'INJI Mock Services',
      document_number: 'PHOTO-ID-001',
      resident_address: '1 Test Street',
      resident_city: 'Bengaluru',
      resident_state: 'Karnataka',
      resident_postal_code: '560001',
      resident_country: 'IN',
    },
    [PHOTO_ID_DOCTYPE]: {
      person_id: 'MOCK-PERSON-001',
      administrative_number: 'PHOTO-ID-001',
    },
  };
}
