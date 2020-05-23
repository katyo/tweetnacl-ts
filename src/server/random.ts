import { ByteArray } from '../array.ts';

export function _randomBytes(x: ByteArray, n: number) {
    for (let i = 0; i < n; i++) {
        x[i] = Math.random();
    }
}