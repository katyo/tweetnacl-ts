import { equal, notEqual } from 'assert';
import { ByteArray, box_keyPair, sealedbox, sealedbox_open, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl';

import randomVectors from './data/sealedbox.random';

const { publicKey: _pk, secretKey: _sk } = box_keyPair();

describe('sealedbox', () => {
    describe('random test vectors', () => {
        randomVectors.forEach(([pk_, sk_, msg_, box_], i) => {
            it(`case ${i}`, () => {
                const pk = dec(pk_);
                const sk = dec(sk_);
                const msg = dec(msg_);
                const box = dec(box_);

                const openedBox1 = sealedbox_open(box, pk, sk);
                notEqual(openedBox1, undefined);
                equal(enc(openedBox1 as ByteArray), enc(msg));

                const realBox = sealedbox(msg, pk);
                const openedBox2 = sealedbox_open(realBox, pk, sk);
                notEqual(openedBox2, undefined);
                equal(enc(openedBox2 as ByteArray), enc(msg));

                const openedBox3 = sealedbox_open(box, _pk, _sk);
                equal(openedBox3, undefined);

                const openedBox4 = sealedbox_open(realBox, _pk, _sk);
                equal(openedBox4, undefined);
            });
        });
    });
});
