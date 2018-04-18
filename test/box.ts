import { equal, notEqual } from 'assert';
import { ByteArray, BoxLength, box, box_open, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl';

import randomVectors from './data/box.random';

describe('box', () => {
    describe('box random test vectors', () => {
        const nonce = ByteArray(BoxLength.Nonce);

        randomVectors.forEach(([pk1_, sk2_, msg_, goodBox_], i) => {
            it(`case ${i}`, () => {
                const pk1 = dec(pk1_);
                const sk2 = dec(sk2_);
                const msg = dec(msg_);
                const goodBox = dec(goodBox_);

                const realBox = box(msg, nonce, pk1, sk2);
                equal(enc(realBox), enc(goodBox));

                const openedBox = box_open(goodBox, nonce, pk1, sk2);
                notEqual(openedBox, undefined);
                equal(enc(openedBox as ByteArray), enc(msg));
            });
        });
    });
});
