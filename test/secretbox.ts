import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
    ByteArray,
    secretbox,
    secretbox_open,
    decodeBase64 as dec,
    encodeBase64 as enc
} from '../src/nacl.ts';

import randomVectors from './data/secretbox.random.ts';

Deno.test('secretbox', () => {
    Deno.test('secretbox random test vectors', () => {
        randomVectors.forEach(([key_, nonce_, msg_, goodBox_], i) => {
            Deno.test(`test vector ${i}`, () => {
                const key = dec(key_);
                const nonce = dec(nonce_);
                const msg = dec(msg_);
                const goodBox = dec(goodBox_);
                const box = secretbox(msg, nonce, key);
                assert(box, 'box should be created');
                assertEquals(enc(box), enc(goodBox));
                const openedBox = secretbox_open(goodBox, nonce, key);
                assert(openedBox, 'box should open');
                assertEquals(enc(openedBox as ByteArray), enc(msg));
            });
        });
    });
});
