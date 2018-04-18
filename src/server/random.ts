import { randomBytes } from 'crypto';
import { ByteArray } from '../array';

export function _randomBytes(x: ByteArray, n: number) {
    const v = randomBytes(n);
    for (let i = 0; i < n; i++) {
        x[i] = v[i];
        v[i] = 0;
    }
}
