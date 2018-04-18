import { equal, notEqual } from 'assert';
import { ByteArray, secretbox, secretbox_open, SecretBoxLength, encodeUTF8, decodeUTF8, encodeBase64 } from '../src/nacl';

describe('secretbox.quick', () => {
    it('secretbox and secretbox_open', () => {
        const key = ByteArray(SecretBoxLength.Key);
        const nonce = ByteArray(SecretBoxLength.Nonce);

        let i;
        for (i = 0; i < key.length; i++) key[i] = i & 0xff;
        for (i = 0; i < nonce.length; i++) nonce[i] = (32 + i) & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const box = secretbox(msg, nonce, key);
        const openedMsg = secretbox_open(box, nonce, key);
        notEqual(openedMsg, undefined);
        equal(encodeUTF8(openedMsg as ByteArray), encodeUTF8(msg), 'opened messages should be equal');
    });

    it('secretbox_open with invalid box', () => {
        const key = ByteArray(SecretBoxLength.Key);
        const nonce = ByteArray(SecretBoxLength.Nonce);

        equal(secretbox_open(ByteArray(0), nonce, key), undefined);
        equal(secretbox_open(ByteArray(10), nonce, key), undefined);
        equal(secretbox_open(ByteArray(100), nonce, key), undefined);
    });

    it('secretbox_open with invalid nonce', () => {
        const key = ByteArray(SecretBoxLength.Key);
        const nonce = ByteArray(SecretBoxLength.Nonce);

        for (let i = 0; i < nonce.length; i++) nonce[i] = i & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const box = secretbox(msg, nonce, key);

        const openedMsg = secretbox_open(box, nonce, key);
        notEqual(openedMsg, undefined);
        equal(encodeUTF8(openedMsg as ByteArray), encodeUTF8(msg));
        nonce[0] = 255;
        equal(secretbox_open(box, nonce, key), undefined);
    });

    it('secretbox_open with invalid key', () => {
        const key = ByteArray(SecretBoxLength.Key);

        for (let i = 0; i < key.length; i++) key[i] = i & 0xff;

        const nonce = ByteArray(SecretBoxLength.Nonce);
        const msg = decodeUTF8('message to encrypt');
        const box = secretbox(msg, nonce, key);

        const openedMsg = secretbox_open(box, nonce, key);
        notEqual(openedMsg, undefined);
        equal(encodeUTF8(openedMsg as ByteArray), encodeUTF8(msg));
        key[0] = 255;
        equal(secretbox_open(box, nonce, key), undefined);
    });

    it('secretbox with message lengths of 0 to 1024', () => {
        const key = ByteArray(SecretBoxLength.Key);

        let i;
        for (i = 0; i < key.length; i++) key[i] = i & 0xff;

        const nonce = ByteArray(SecretBoxLength.Nonce);
        const fullMsg = ByteArray(1024);

        for (i = 0; i < fullMsg.length; i++) fullMsg[i] = i & 0xff;
        for (i = 0; i < fullMsg.length; i++) {
            const msg = fullMsg.subarray(0, i);
            const box = secretbox(msg, nonce, key);
            const unbox = secretbox_open(box, nonce, key);
            notEqual(unbox, undefined);
            equal(encodeBase64(msg), encodeBase64(unbox as ByteArray));
        }
    });
});
