import { assert } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, verify } from '../src/nacl.ts';

const a = ByteArray(764), b = ByteArray(764);
for (let i = 0; i < a.length; i++) a[i] = b[i] = i & 0xff;

Deno.test('verify.quick', () => {
    Deno.test('arrays of length 1 and 1K', () => {
        assert(verify(ByteArray(1), ByteArray(1)), 'equal arrays of length 1 should verify');
        assert(verify(ByteArray(1000), ByteArray(1000)), 'equal arrays of length 1000 should verify');
    });

    Deno.test('equal and same arrays', () => {
        assert(verify(a, b), 'equal arrays should verify');
        assert(verify(a, a), 'same arrays should verify');
    });

    Deno.test('failed', () => {
        b[0] = 255;
        assert(!verify(a, b), 'different arrays don\'t verify');
        assert(!verify(ByteArray(1), ByteArray(10)), 'arrays of different lengths should not verify');
        assert(!verify(ByteArray(0), ByteArray(0)), 'zero-length arrays should not verify');
    });
});
