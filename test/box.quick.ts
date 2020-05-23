import { assertEquals, assertNotEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, BoxLength, box_keyPair, box_keyPair_fromSecretKey, box, box_open, encodeBase64 as enc, encodeUTF8, decodeUTF8 } from '../src/nacl.ts';

Deno.test('box.quick', () => {
    Deno.test('box_keyPair', () => {
        const keys = box_keyPair();
        assert(keys.secretKey && keys.secretKey.length === BoxLength.SecretKey, 'has secret key');
        assert(keys.publicKey && keys.publicKey.length === BoxLength.PublicKey, 'has public key');
        assertNotEquals(enc(keys.secretKey), enc(keys.publicKey));
    });

    Deno.test('box_keyPair_fromSecretKey', () => {
        const k1 = box_keyPair();
        const k2 = box_keyPair_fromSecretKey(k1.secretKey);
        assertEquals(enc(k2.secretKey), enc(k1.secretKey));
        assertEquals(enc(k2.publicKey), enc(k1.publicKey));
    });

    Deno.test('box and box_open', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);

        for (let i = 0; i < nonce.length; i++) nonce[i] = (32 + i) & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const clientBox = box(msg, nonce, serverKeys.publicKey, clientKeys.secretKey);
        const clientMsg = box_open(clientBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        assertNotEquals(clientMsg, undefined);
        assertEquals(encodeUTF8(clientMsg as ByteArray), encodeUTF8(msg));

        const serverBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        assertEquals(enc(clientBox), enc(serverBox));

        const serverMsg = box_open(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        assertNotEquals(serverMsg, undefined);
        assertEquals(encodeUTF8(serverMsg as ByteArray), encodeUTF8(msg));
    });

    Deno.test('box_open with invalid box', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);
        assertEquals(box_open(ByteArray(0), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
        assertEquals(box_open(ByteArray(10), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
        assertEquals(box_open(ByteArray(100), nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
    });

    Deno.test('box_open with invalid nonce', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);

        for (let i = 0; i < nonce.length; i++) nonce[i] = i & 0xff;

        const msg = decodeUTF8('message to encrypt');
        const realBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const unboxedMsg = box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        assertNotEquals(unboxedMsg, undefined);
        assertEquals(encodeUTF8(unboxedMsg as ByteArray), encodeUTF8(msg));

        nonce[0] = 255;
        assertEquals(box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey), undefined);
    });

    Deno.test('box_open with invalid keys', () => {
        const clientKeys = box_keyPair();
        const serverKeys = box_keyPair();
        const nonce = ByteArray(BoxLength.Nonce);
        const msg = decodeUTF8('message to encrypt');

        const realBox = box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const unboxedMsg1 = box_open(realBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        assertNotEquals(unboxedMsg1, undefined);
        assertEquals(encodeUTF8(unboxedMsg1 as ByteArray), encodeUTF8(msg));
        const unboxedMsg2 = box_open(realBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        assertNotEquals(unboxedMsg2, undefined);
        assertEquals(encodeUTF8(unboxedMsg2 as ByteArray), encodeUTF8(msg));

        const badPublicKey = ByteArray(BoxLength.PublicKey);
        assertEquals(box_open(realBox, nonce, badPublicKey, clientKeys.secretKey), undefined);

        const badSecretKey = ByteArray(BoxLength.SecretKey);
        assertEquals(box_open(realBox, nonce, serverKeys.publicKey, badSecretKey), undefined);
    });
});
