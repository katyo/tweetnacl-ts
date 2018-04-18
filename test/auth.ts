import { equal } from 'assert';
import { auth, auth_full, decodeBase64, encodeBase64 } from '../src/nacl';

import randomVectors from './data/hmac.random';

describe('auth', () => {
    describe('hmac random test vectors', () => {
        randomVectors.forEach(([msg_, key_, goodMac_], i) => {
            it(`case ${i}`, () => {
                const msg = decodeBase64(msg_);
                const key = decodeBase64(key_);
                const goodMac = decodeBase64(goodMac_);

                const mac = auth(msg, key);
                equal(encodeBase64(mac), encodeBase64(goodMac.subarray(0, 32)));

                const fullMac = auth_full(msg, key);
                equal(encodeBase64(fullMac), encodeBase64(goodMac));
            });
        });
    });
});
