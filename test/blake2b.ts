import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, WordArray, blake2b, decodeUTF8, decodeHex as dec, encodeHex as enc } from '../src/nacl.ts';

import generatedVectors from './data/blake2b.spec.ts';

Deno.test('Blake2B', () => {
    Deno.test('basic', () => {
        // From the example computation in the RFC
        assertEquals(enc(blake2b(decodeUTF8('abc'))),
            'ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923');
            assertEquals(enc(blake2b(decodeUTF8(''))),
            '786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce');
            assertEquals(enc(blake2b(decodeUTF8('The quick brown fox jumps over the lazy dog'))),
            'a8add4bdddfd93e4877d2746e62817b116364a1fa7bc148d95090bc7333b3673f82401cf7aa2e4cb1ecd90296e3f14cb5413f8ed77be73045b13914cdcd6a918');
    });

    Deno.test('input types', () => {
        // Supports string, Uint8Array, and Buffer inputs
        // We already verify that blake2bHex('abc') produces the correct hash above
        assertEquals(enc(blake2b(ByteArray([97, 98, 99]))), enc(blake2b(decodeUTF8('abc'))));
    });

    Deno.test('generated test vectors', () => {
        generatedVectors.forEach(([input, key, outLen, out], i) => {
            Deno.test(`case ${i}`, () => {
                assertEquals(enc(blake2b(dec(input.toString()), dec(key.toString()), Number.parseInt(outLen.toString()))), out);
            });
        });
    });

    Deno.test('Byte counter should support values up to 2**53', () => {
        const testCases = [
            { t: 1, a0: 1, a1: 0 },
            { t: 0xffffffff, a0: 0xffffffff, a1: 0 },
            { t: 0x100000000, a0: 0, a1: 1 },
            { t: 0x123456789abcd, a0: 0x6789abcd, a1: 0x12345 },
            // test 2**53 - 1
            { t: 0x1fffffffffffff, a0: 0xffffffff, a1: 0x1fffff }
        ];

        testCases.forEach((testCase, i) => {
            Deno.test(`case ${i}`, () => {
                const arr = WordArray([0, 0]);

                // test the code that's inlined in both blake2s.js and blake2b.js
                // to make sure Deno.test splDeno.tests byte counters up to 2**53 into uint32s correctly
                arr[0] ^= testCase.t;
                arr[1] ^= (testCase.t / 0x100000000);

                assertEquals(arr[0], testCase.a0);
                assertEquals(arr[1], testCase.a1);
            });
        })
    });
});
