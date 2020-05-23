import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, scalarMult, scalarMult_base, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl.ts';

import randomVectors from './data/scalarmult.random.ts';

Deno.test('scalarmult', () => {
    Deno.test('scalarMult_base', () => {
        // This takes takes a bit of time.
        // Similar to https://code.google.com/p/go/source/browse/curve25519/curve25519_tesgo?repo=crypto

        const golden = ByteArray([0x89, 0x16, 0x1f, 0xde, 0x88, 0x7b, 0x2b, 0x53, 0xde, 0x54,
            0x9a, 0xf4, 0x83, 0x94, 0x01, 0x06, 0xec, 0xc1, 0x14, 0xd6, 0x98, 0x2d,
            0xaa, 0x98, 0x25, 0x6d, 0xe2, 0x3b, 0xdf, 0x77, 0x66, 0x1a]);

        let input = ByteArray([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        for (let i = 0; i < 200; i++) {
            input = scalarMult_base(input);
        }

        assertEquals(enc(input), enc(golden));
    });

    Deno.test('scalarMult and scalarMult_base random test vectors', () => {
        randomVectors.forEach(([pk1_, sk1_, pk2_, sk2_, out_], i) => {
            Deno.test(`case ${i}`, () => {
                const pk1 = dec(pk1_);
                const sk1 = dec(sk1_);
                const pk2 = dec(pk2_);
                const sk2 = dec(sk2_);
                const out = dec(out_);

                const jpk1 = scalarMult_base(sk1);
                assertEquals(enc(jpk1), enc(pk1));

                const jpk2 = scalarMult_base(sk2);
                assertEquals(enc(jpk2), enc(pk2));

                const jout1 = scalarMult(sk1, pk2);
                assertEquals(enc(jout1), enc(out));

                const jout2 = scalarMult(sk2, pk1);
                assertEquals(enc(jout2), enc(out));
            });
        });
    });
});
