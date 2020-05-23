import { ByteArray } from './array.ts';
import { _randomBytes } from './server/random.ts';

export { _randomBytes };

export function randomBytes(n: number): ByteArray {
    const b = ByteArray(n);
    _randomBytes(b, n);
    return b;
}
