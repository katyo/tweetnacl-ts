import { ok, equal } from 'assert';
import { ByteArray, SignLength, sign_keyPair_fromSecretKey, sign, sign_open, sign_detached, sign_detached_verify, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl';

import specVectors from './data/sign.spec';

describe('sign', () => {
    describe('sign and sign_open specified vectors', () => {
        specVectors.forEach(([secretKey_, msg_, goodSig_], i) => {
            it(`case ${i}`, () => {
                const keys = sign_keyPair_fromSecretKey(dec(secretKey_));
                const msg = dec(msg_);
                const goodSig = dec(goodSig_);

                const signedMsg = sign(msg, keys.secretKey);
                equal(enc(signedMsg.subarray(0, SignLength.Signature)), enc(goodSig), 'signatures must be equal');

                const openedMsg = sign_open(signedMsg, keys.publicKey);
                ok(openedMsg, 'message must be verified');
                equal(enc(openedMsg as ByteArray), enc(msg), 'messages must be equal');
            });
        });
    });

    describe('sign_detached and sign_detached_verify some specified vectors', () => {
        specVectors.forEach(([secretKey_, msg_, goodSig_], i) => {
            // We don't need to test all, as internals are already tested above.
            if (i % 100 !== 0) return;

            it(`case ${i}`, () => {
                const keys = sign_keyPair_fromSecretKey(dec(secretKey_));
                const msg = dec(msg_);
                const goodSig = dec(goodSig_);

                const sig = sign_detached(msg, keys.secretKey);
                equal(enc(sig), enc(goodSig), 'signatures must be equal');

                const result = sign_detached_verify(msg, sig, keys.publicKey);
                ok(result, 'signature must be verified');
            });
        });
    });
});
