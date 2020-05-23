import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import {
    ByteArray,
    box_keyPair,
    sealedbox,
    sealedbox_open,
    decodeBase64 as dec,
    encodeBase64 as enc
} from '../src/nacl.ts';

import randomVectors from './data/sealedbox.random.ts';

const { publicKey: _pk, secretKey: _sk } = box_keyPair();

Deno.test('sealedbox', () => {
    Deno.test('random test vectors', () => {
        randomVectors.forEach(([pk_, sk_, msg_, box_], i) => {
            Deno.test(`case ${i}`, () => {
                const pk = dec(pk_);
                const sk = dec(sk_);
                const msg = dec(msg_);
                const box = dec(box_);

                const openedBox1 = sealedbox_open(box, pk, sk);
                assertNotEquals(openedBox1, undefined);
                assertEquals(enc(openedBox1 as ByteArray), enc(msg));

                const realBox = sealedbox(msg, pk);
                const openedBox2 = sealedbox_open(realBox, pk, sk);
                assertNotEquals(openedBox2, undefined);
                assertEquals(enc(openedBox2 as ByteArray), enc(msg));

                const openedBox3 = sealedbox_open(box, _pk, _sk);
                assertEquals(openedBox3, undefined);

                const openedBox4 = sealedbox_open(realBox, _pk, _sk);
                assertEquals(openedBox4, undefined);
            });
        });
    });
});
