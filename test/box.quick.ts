import { ok, equal, notEqual } from 'assert';
import { ByteArray, BoxLength, box_keyPair, box_keyPair_fromSecretKey, box, box_open, encodeBase64 as enc, encodeUTF8, decodeUTF8 } from '../src/nacl';

describe('box.quick', () => {
    it('box_keyPair', () => {
        const keys = box_keyPair();
        ok(keys.secretKey && keys.secretKey.length === BoxLength.SecretKey, 'has secret key');
        ok(keys.publicKey && keys.publicKey.length === BoxLength.PublicKey, 'has public key');
        notEqual(enc(keys.secretKey), enc(keys.publicKey));
    });

    it('box_keyPair_fromSecretKey', () => {
        const k1 = box_keyPair();
        const k2 = box_keyPair_fromSecretKey(k1.secretKey);
        equal(enc(k2.secretKey), enc(k1.secretKey));
        equal(enc(k2.publicKey), enc(k1.publicKey));
    });

    it('box and box_open', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);

        for (let i = 0; i < nonce.length; i++) nonce[i] = (32 + i) & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const clientBox = box(msg, nonce, serverKeys.publicKey, clientKeys.secretKey);
        const clientMsg = box_open(clientBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        notEqual(clientMsg, undefined);
        equal(encodeUTF8(clientMsg as ByteArray), encodeUTF8(msg));

        const serverBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        equal(enc(clientBox), enc(serverBox));

        const serverMsg = box_open(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        notEqual(serverMsg, undefined);
        equal(encodeUTF8(serverMsg as ByteArray), encodeUTF8(msg));
    });

    it('box_open with invalid box', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);
        equal(box_open(ByteArray(0), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
        equal(box_open(ByteArray(10), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
        equal(box_open(ByteArray(100), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
    });

    it('box_open with invalid nonce', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);

        for (let i = 0; i < nonce.length; i++) nonce[i] = i & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const realBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const unboxedMsg = box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        notEqual(unboxedMsg, undefined);
        equal(encodeUTF8(unboxedMsg as ByteArray), encodeUTF8(msg));

        nonce[0] = 255;
        equal(box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
    });

    it('box_open with invalid keys', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);
        const msg = decodeUTF8('message to encrypt');

        const realBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const unboxedMsg1 = box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        notEqual(unboxedMsg1, undefined);
        equal(encodeUTF8(unboxedMsg1 as ByteArray), encodeUTF8(msg));
        const unboxedMsg2 = box_open(realBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        notEqual(unboxedMsg2, undefined);
        equal(encodeUTF8(unboxedMsg2 as ByteArray), encodeUTF8(msg));

        const badPublicKey = ByteArray(BoxLength.PublicKey);
        equal(box_open(realBox, nonce, badPublicKey, clientKeys.secretKey), undefined);

        const badSecretKey = ByteArray(BoxLength.SecretKey);
        equal(box_open(realBox, nonce, serverKeys.publicKey, badSecretKey), undefined);
    });
});
