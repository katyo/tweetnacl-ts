// Initialize PRNG if environment provides CSPRNG.
// If not, methods calling randombytes will throw.

import { ByteArray } from '../array';

const QUOTE = 1 << 16;

export function _randomBytes(x: ByteArray, n: number) {
    for (let i = 0; i < n; i += QUOTE) {
        crypto.getRandomValues(x.subarray(i, i + Math.min(n - i, QUOTE)));
    }
}
