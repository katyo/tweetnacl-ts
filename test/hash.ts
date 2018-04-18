import { equal } from 'assert';
import { hash, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl';

import randomVectors from './data/hash.random';

describe('hash', () => {
    describe('hash random test vectors', () => {
        randomVectors.forEach(([msg_, goodHash_], i) => {
            const msg = dec(msg_);
            const goodHash = dec(goodHash_);
            const realHash = hash(msg);
            equal(enc(realHash), enc(goodHash));
        });
    });
});
