import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, hash, encodeBase64 as enc } from '../src/nacl.ts';

import specVectors from './data/hash.spec.ts';

Deno.test('hash.quick', () => {
    Deno.test('hash length', () => {
        assertEquals(hash(ByteArray(0)).length, 64);
        assertEquals(hash(ByteArray(100)).length, 64);
    });

    Deno.test('hash exceptions for bad types', () => {
        assertThrows(() => { hash('string' as any as ByteArray); }, TypeError, 'should throw TypeError for string type');
        assertThrows(() => { hash([1, 2, 3] as any as ByteArray); }, TypeError, 'should throw TypeError for array type');
    });

    Deno.test('hash specified test vectors', () => {
        specVectors.forEach(([goodHash_, msg_], i) => {
            Deno.test(`case ${i}`, () => {
                const goodHash = ByteArray(goodHash_);
                const msg = ByteArray(msg_);
                const realHash = hash(msg);

                assertEquals(enc(realHash), enc(goodHash));
            });
        });
    });
});
