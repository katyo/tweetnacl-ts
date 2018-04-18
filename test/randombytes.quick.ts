import { fail } from 'assert';
import { randomBytes, encodeBase64 } from '../src/nacl';

describe('randomBytes.quick', () => {
    describe('randomBytes', () => {
        it('find collisions', () => {
            const set: Record<string, boolean> = {};
            let s, i;

            for (i = 0; i < 10000; i++) {
                s = encodeBase64(randomBytes(32));
                if (set[s]) {
                    fail('duplicate random sequence!', s);
                    return;
                }
                set[s] = true;
            }
        });
    });
});
