import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
    ByteArray,
    WordArray,
    blake2s,
    blake2s_init,
    blake2s_update,
    blake2s_final,
    decodeUTF8,
    encodeHex as enc
} from '../src/nacl.ts';

Deno.test('Blake2S', () => {
    Deno.test('basic', () => {
        // From the example computation in the RFC
        assertEquals(enc(blake2s(decodeUTF8('abc'))), '508c5e8c327c14e2e1a72ba34eeb452f37458b209ed63a294d999b4c86675982');
        assertEquals(enc(blake2s(ByteArray([97, 98, 99]))), '508c5e8c327c14e2e1a72ba34eeb452f37458b209ed63a294d999b4c86675982');
    })

    Deno.test('self test', () => {
        // Grand hash of hash results
        const expectedHash = [
            0x6A, 0x41, 0x1F, 0x08, 0xCE, 0x25, 0xAD, 0xCD,
            0xFB, 0x02, 0xAB, 0xA6, 0x41, 0x45, 0x1C, 0xEC,
            0x53, 0xC5, 0x98, 0xB2, 0x4F, 0x4F, 0xC7, 0x87,
            0xFB, 0xDC, 0x88, 0x79, 0x7F, 0x4C, 0x1D, 0xFE
        ];

        // Parameter sets
        const outputLengths = [16, 20, 28, 32];
        const inputLengths = [0, 3, 64, 65, 255, 1024];

        // 256-bit hash for testing
        const ctx = blake2s_init(32);

        for (let i = 0; i < 4; i++) {
            const outlen = outputLengths[i];
            for (let j = 0; j < 6; j++) {
                const inlen = inputLengths[j];

                const arr = generateInput(inlen, inlen);
                let hash = blake2s(arr, undefined, outlen); // unkeyed hash
                blake2s_update(ctx, hash); // hash the hash

                const key = generateInput(outlen, outlen);
                hash = blake2s(arr, key, outlen); // keyed hash
                blake2s_update(ctx, hash); // hash the hash
            }
        }

        // Compute and compare the hash of hashes
        const finalHash = blake2s_final(ctx);
        assertEquals(enc(finalHash), enc(ByteArray(expectedHash)));
    })

    // Returns a Uint8Array of len bytes
    function generateInput(len: number, seed: number) {
        const out = ByteArray(len);
        const a = WordArray(3);
        a[0] = 0xDEAD4BAD * seed; // prime
        a[1] = 1;
        for (let i = 0; i < len; i++) { // fill the buf
            a[2] = a[0] + a[1];
            a[0] = a[1];
            a[1] = a[2];
            out[i] = (a[2] >>> 24) & 0xFF;
        }
        return out;
    }
});
