import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { hash, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl.ts';

import randomVectors from './data/hash.random.ts';

Deno.test('hash', () => {
    Deno.test('hash random test vectors', () => {
        randomVectors.forEach(([msg_, goodHash_], i) => {
            const msg = dec(msg_);
            const goodHash = dec(goodHash_);
            const realHash = hash(msg);
            assertEquals(enc(realHash), enc(goodHash));
        });
    });
});
