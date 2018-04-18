import { equal, throws } from 'assert';
import { ByteArray, hash, encodeBase64 as enc } from '../src/nacl';

import specVectors from './data/hash.spec';

describe('hash.quick', () => {
    it('hash length', () => {
        equal(hash(ByteArray(0)).length, 64);
        equal(hash(ByteArray(100)).length, 64);
    });

    it('hash exceptions for bad types', () => {
        throws(() => { hash('string' as any as ByteArray); }, TypeError, 'should throw TypeError for string type');
        throws(() => { hash([1, 2, 3] as any as ByteArray); }, TypeError, 'should throw TypeError for array type');
    });

    describe('hash specified test vectors', () => {
        specVectors.forEach(([goodHash_, msg_], i) => {
            it(`case ${i}`, () => {
                const goodHash = ByteArray(goodHash_);
                const msg = ByteArray(msg_);
                const realHash = hash(msg);

                equal(enc(realHash), enc(goodHash));
            });
        });
    });
});
