import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, _onetimeauth, encodeBase64 } from '../src/nacl.ts';
import specVectors from './data/onetimeauth.spec.ts';

Deno.test('onetimeauth.quick', () => {
    Deno.test('onetimeauth specified vectors', () => {
        const _out = ByteArray(16);

        specVectors.forEach(([m_, k_, out_], i) => {
            Deno.test(`test spec #${i}`, () => {
                const m = ByteArray(m_);
                const k = ByteArray(k_);
                const out = ByteArray(out_);

                _onetimeauth(_out, 0, m, 0, m.length, k);
                assertEquals(encodeBase64(_out), encodeBase64(out));
            });
        });
    });
});
