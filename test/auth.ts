import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { auth, auth_full, decodeBase64, encodeBase64 } from '../src/nacl.ts';

import randomVectors from './data/hmac.random.ts';

Deno.test('auth', () => {
    Deno.test('hmac random test vectors', () => {
        randomVectors.forEach(([msg_, key_, goodMac_], i) => {
            Deno.test(`case ${i}`, () => {
                const msg = decodeBase64(msg_);
                const key = decodeBase64(key_);
                const goodMac = decodeBase64(goodMac_);

                const mac = auth(msg, key);
                assertEquals(encodeBase64(mac), encodeBase64(goodMac.subarray(0, 32)));

                const fullMac = auth_full(msg, key);
                assertEquals(encodeBase64(fullMac), encodeBase64(goodMac));
            });
        });
    });
});
