import { ok } from 'assert';
import { ByteArray, verify } from '../src/nacl';

const a = ByteArray(764), b = ByteArray(764);
for (let i = 0; i < a.length; i++) a[i] = b[i] = i & 0xff;

describe('verify.quick', () => {
    it('arrays of length 1 and 1K', () => {
        ok(verify(ByteArray(1), ByteArray(1)), 'equal arrays of length 1 should verify');
        ok(verify(ByteArray(1000), ByteArray(1000)), 'equal arrays of length 1000 should verify');
    });

    it('equal and same arrays', () => {
        ok(verify(a, b), 'equal arrays should verify');
        ok(verify(a, a), 'same arrays should verify');
    });

    it('failed', () => {
        b[0] = 255;
        ok(!verify(a, b), 'different arrays don\'t verify');
        ok(!verify(ByteArray(1), ByteArray(10)), 'arrays of different lengths should not verify');
        ok(!verify(ByteArray(0), ByteArray(0)), 'zero-length arrays should not verify');
    });
});
