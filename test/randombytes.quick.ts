import { assert } from "https://deno.land/std/testing/asserts.ts";
import { randomBytes, encodeBase64 } from '../src/nacl.ts';

Deno.test('randomBytes.quick', () => {
    Deno.test('randomBytes', () => {
        Deno.test('find collisions', () => {
            const set: Record<string, boolean> = {};
            let s, i;

            for (i = 0; i < 10000; i++) {
                s = encodeBase64(randomBytes(32));

                assert(!set[s]);
                
                set[s] = true;
            }
        });
    });
});
