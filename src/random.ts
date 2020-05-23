import { ByteArray } from './array.ts';

export function randomBytes(n: number): ByteArray {
    let b = ByteArray(n);
    window.crypto.getRandomValues(b);
    return b;
}
