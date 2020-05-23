import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, BoxLength, box, box_open, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl.ts';

import randomVectors from './data/box.random.ts';

Deno.test('box', () => {
    Deno.test('box random test vectors', () => {
        const nonce = ByteArray(BoxLength.Nonce);

        randomVectors.forEach(([pk1_, sk2_, msg_, goodBox_], i) => {
            Deno.test(`case ${i}`, () => {
                const pk1 = dec(pk1_);
                const sk2 = dec(sk2_);
                const msg = dec(msg_);
                const goodBox = dec(goodBox_);

                const realBox = box(msg, nonce, pk1, sk2);
                assertEquals(enc(realBox), enc(goodBox));

                const openedBox = box_open(goodBox, nonce, pk1, sk2);
                assertNotEquals(openedBox, undefined);
                assertEquals(enc(openedBox as ByteArray), enc(msg));
            });
        });
    });
});
