import { ok, equal } from 'assert';
import { ByteArray, secretbox, secretbox_open, decodeBase64 as dec, encodeBase64 as enc } from '../src/nacl';

import randomVectors from './data/secretbox.random';

describe('secretbox', () => {
    describe('secretbox random test vectors', () => {
        randomVectors.forEach(([key_, nonce_, msg_, goodBox_], i) => {
            it(`test vector ${i}`, () => {
                const key = dec(key_);
                const nonce = dec(nonce_);
                const msg = dec(msg_);
                const goodBox = dec(goodBox_);
                const box = secretbox(msg, nonce, key);
                ok(box, 'box should be created');
                equal(enc(box), enc(goodBox));
                const openedBox = secretbox_open(goodBox, nonce, key);
                ok(openedBox, 'box should open');
                equal(enc(openedBox as ByteArray), enc(msg));
            });
        });
    });
});
