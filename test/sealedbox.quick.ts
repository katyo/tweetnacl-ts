import { equal, notEqual } from 'assert';
import { ByteArray, BoxLength, box_keyPair, sealedbox, sealedbox_open, encodeUTF8, decodeUTF8 } from '../src/nacl';

describe('sealedbox.quick', () => {
    it('sealedbox and sealedbox_open', () => {
        const keyPair = box_keyPair();

        const msg = decodeUTF8('message to encrypt');
        const box = sealedbox(msg, keyPair.publicKey);
        const outMsg = sealedbox_open(box, keyPair.publicKey, keyPair.secretKey);

        notEqual(outMsg, undefined);
        equal(encodeUTF8(outMsg as ByteArray), encodeUTF8(msg));
    });

    it('sealedbox_open with invalid box', () => {
        const keyPair = box_keyPair();
        equal(sealedbox_open(ByteArray(0), keyPair.publicKey, keyPair.secretKey), undefined);
        equal(sealedbox_open(ByteArray(10), keyPair.publicKey, keyPair.secretKey), undefined);
        equal(sealedbox_open(ByteArray(100), keyPair.publicKey, keyPair.secretKey), undefined);
    });

    it('sealedbox_open with invalid keys', () => {
        const keyPair = box_keyPair();
        const msg = decodeUTF8('message to encrypt');

        const realBox = sealedbox(msg, keyPair.publicKey);
        const unboxedMsg = sealedbox_open(realBox, keyPair.publicKey, keyPair.secretKey);
        notEqual(unboxedMsg, undefined);
        equal(encodeUTF8(unboxedMsg as ByteArray), encodeUTF8(msg));

        const badPublicKey = ByteArray(BoxLength.PublicKey);
        equal(sealedbox_open(realBox, badPublicKey, keyPair.secretKey), undefined);

        const badSecretKey = ByteArray(BoxLength.SecretKey);
        equal(sealedbox_open(realBox, keyPair.publicKey, badSecretKey), undefined);
    });
});
