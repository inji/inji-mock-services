import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { exportJWK, exportPKCS8, generateKeyPair } from 'jose';

const execFileAsync = promisify(execFile);
let signingIdentity;

async function createSigningIdentity() {
  const directory = await mkdtemp(join(tmpdir(), 'inji-mdoc-'));
  const rootKey = join(directory, 'root.key');
  const rootCert = join(directory, 'root.pem');
  const signerKey = join(directory, 'signer.key');
  const signerCsr = join(directory, 'signer.csr');
  const signerCert = join(directory, 'signer.der');
  const extensions = join(directory, 'signer.ext');
  const run = args => execFileAsync('openssl', args, { timeout: 10000, maxBuffer: 1 << 20 });
  try {
    const { privateKey } = await generateKeyPair('ES256');
    await writeFile(signerKey, await exportPKCS8(privateKey), { mode: 0o600 });
    await writeFile(extensions, [
      'basicConstraints=critical,CA:FALSE',
      'keyUsage=critical,digitalSignature',
      'extendedKeyUsage=1.0.18013.5.1.2',
      'subjectKeyIdentifier=hash',
      'authorityKeyIdentifier=keyid',
    ].join('\n'));
    await run(['req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:P-256',
      '-nodes', '-keyout', rootKey, '-out', rootCert, '-days', '3650',
      '-subj', '/C=IN/O=INJI Mock Services/CN=INJI Mock IACA',
      '-addext', 'basicConstraints=critical,CA:TRUE,pathlen:0',
      '-addext', 'keyUsage=critical,keyCertSign,cRLSign']);
    await run(['req', '-new', '-key', signerKey, '-out', signerCsr,
      '-subj', '/C=IN/O=INJI Mock Services/CN=INJI Mock Document Signer']);
    await run(['x509', '-req', '-in', signerCsr, '-CA', rootCert, '-CAkey', rootKey,
      '-CAcreateserial', '-days', '365', '-extfile', extensions, '-outform', 'DER', '-out', signerCert]);
    return {
      privateKeyJwk: await exportJWK(privateKey),
      certificate: await readFile(signerCert),
      rootCertificatePem: await readFile(rootCert, 'utf8'),
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

// One mock IACA and signer per service process, shared by concurrent issuance requests.
export function mdocSigningIdentity() {
  if (!signingIdentity) {
    signingIdentity = createSigningIdentity().catch(error => {
      signingIdentity = undefined;
      throw error;
    });
  }
  return signingIdentity;
}

export async function mdocIssuerCertificate(_req, res) {
  const { rootCertificatePem } = await mdocSigningIdentity();
  res.type('application/x-pem-file').send(rootCertificatePem);
}
