import { ByteArray } from './array';
import { _randomBytes } from './server/random';

export { _randomBytes };

export function randomBytes(n: number): ByteArray {
    const b = ByteArray(n);
    _randomBytes(b, n);
    return b;
}
