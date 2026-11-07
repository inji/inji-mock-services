import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash, verify, X509Certificate } from 'node:crypto';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import { Encoder, decode } from 'cbor-x';
import credentialEndpoint from '../src/credential/endpoint.js';
import issuerMetadata from '../src/issuer-metadata.js';
import credentialOffer from '../src/credential/offer.js';
import { resolveIssuanceOptions } from '../src/issuance-options.js';
import { mdocSigningIdentity } from '../src/credential/mdoc-signing-key.js';
import { STATIC_MDL_MDOC_SAMPLE_B64URL } from '../src/credential/static-vc.js';

const docType = 'org.iso.23220.photoid.1';
const namespace = 'org.iso.23220.1';
const encoder = new Encoder({useRecords: false, useTag259ForMaps: false, variableMapSize: true});
const get = (value, key) => value instanceof Map ? value.get(key) : value[key];
const entries = value => value instanceof Map ? value.entries() : Object.entries(value);
function response() {
  return { code: 200, status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; } };
}
async function proof(binding = 'jwk') {
  const {privateKey, publicKey} = await generateKeyPair('ES256');
  const jwk = await exportJWK(publicKey);
  const header = binding === 'jwk' ? {jwk} : {kid: `did:jwk:${Buffer.from(JSON.stringify(jwk)).toString('base64url')}#0`};
  return {jwk, jwt: await new SignJWT({nonce: 'mock_nonce_123'})
    .setProtectedHeader({alg: 'ES256', typ: 'openid4vci-proof+jwt', ...header})
    .setIssuedAt().sign(privateKey)};
}

for (const version of ['v1', 'draft13']) {
  test(`${version}: advertises Photo ID alongside mDL and offers its configuration`, () => {
    const metadata = response();
    issuerMetadata({params: {version}}, metadata);
    const config = metadata.body.credential_configurations_supported.PhotoIdVerifiableCredential;
    assert.equal(config.doctype, docType);
    assert.equal(config.format, 'mso_mdoc');
    assert.equal(metadata.body.credential_configurations_supported.MdocVerifiableCredential.doctype, 'org.iso.18013.5.1.mDL');
    const display = version === 'v1' ? config.credential_metadata.display : config.display;
    const claims = version === 'v1' ? config.credential_metadata.claims : config.claims;
    assert.equal(display[0].name, 'Photo ID');
    assert.ok(claims.some(claim => claim.path.join('/') === `${namespace}/portrait`));
    const offer = response();
    credentialOffer({query: {credential: 'photo-id', flow: 'pre-auth', version}}, offer);
    assert.deepEqual(offer.body.credential_configuration_ids, ['PhotoIdVerifiableCredential']);
    assert.equal(resolveIssuanceOptions({credential: 'photo-id'}).credentialDetails.scope, 'photoid.read');
  });
}

for (const [version, binding] of [['v1', 'jwk'], ['v1', 'did:jwk'], ['draft13', 'jwk']]) {
  test(`${version}/${binding}: issues a holder-bound Photo ID with verifiable signature and digests`, async () => {
    const holder = await proof(binding);
    const body = version === 'v1'
      ? {credential_configuration_id: 'PhotoIdVerifiableCredential', proofs: {jwt: [holder.jwt]}}
      : {format: 'mso_mdoc', doctype: docType, proof: {jwt: holder.jwt}};
    const res = response();
    await credentialEndpoint({body, params: {version}, headers: {}}, res);
    assert.equal(res.code, 200, JSON.stringify(res.body));
    const encoded = version === 'v1' ? res.body.credentials[0].credential : res.body.credential;
    const credential = decode(Buffer.from(encoded, 'base64url'));
    assert.equal(credential.docType, docType);
    const auth = credential.issuerSigned.issuerAuth;
    assert.equal(auth.length, 4);
    const signer = new X509Certificate(get(auth[1], 33));
    const identity = await mdocSigningIdentity();
    const root = new X509Certificate(identity.rootCertificatePem);
    assert.ok(root.ca);
    assert.ok(signer.verify(root.publicKey));
    const signatureStructure = encoder.encode(['Signature1', auth[0], Buffer.alloc(0), auth[2]]);
    assert.ok(verify('sha256', signatureStructure, {key: signer.publicKey, dsaEncoding: 'ieee-p1363'}, auth[3]));
    const mso = decode(decode(auth[2]).value);
    assert.equal(mso.docType, docType);
    assert.deepEqual(Buffer.from(get(mso.deviceKeyInfo.deviceKey, -2)), Buffer.from(holder.jwk.x, 'base64url'));
    assert.deepEqual(Buffer.from(get(mso.deviceKeyInfo.deviceKey, -3)), Buffer.from(holder.jwk.y, 'base64url'));
    assert.ok(new Date(mso.validityInfo.validUntil.value ?? mso.validityInfo.validUntil) > new Date());
    for (const [ns, items] of entries(credential.issuerSigned.nameSpaces)) {
      for (const item of items) {
        const claim = decode(item.value);
        const digest = createHash('sha256').update(encoder.encode(item)).digest();
        assert.deepEqual(digest, Buffer.from(get(get(mso.valueDigests, ns), claim.digestID)));
      }
    }
    const claims = credential.issuerSigned.nameSpaces[namespace].map(item => decode(item.value));
    assert.equal(claims.find(claim => claim.elementIdentifier === 'given_name').elementValue, 'Erika');
    assert.ok(Buffer.isBuffer(claims.find(claim => claim.elementIdentifier === 'portrait').elementValue));
  });
}

test('rejects a Photo ID proof signed with another holder key', async () => {
  const holder = await proof();
  const {privateKey} = await generateKeyPair('ES256');
  const jwt = await new SignJWT({}).setProtectedHeader({alg: 'ES256', jwk: holder.jwk}).sign(privateKey);
  const res = response();
  await credentialEndpoint({body: {credential_configuration_id: 'PhotoIdVerifiableCredential', proofs: {jwt: [jwt]}}, params: {version: 'v1'}, headers: {}}, res);
  assert.equal(res.code, 400);
  assert.equal(res.body.error, 'invalid_proof');
});

test('preserves the existing mDL sample response', async () => {
  const holder = await proof();
  const res = response();
  await credentialEndpoint({body: {credential_configuration_id: 'MdocVerifiableCredential', proofs: {jwt: [holder.jwt]}}, params: {version: 'v1'}, headers: {}}, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.credentials[0].credential, STATIC_MDL_MDOC_SAMPLE_B64URL);
});
