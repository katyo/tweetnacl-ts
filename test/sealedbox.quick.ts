import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import {
    ByteArray,
    BoxLength,
    box_keyPair,
    sealedbox,
    sealedbox_open,
    encodeUTF8,
    decodeUTF8
} from '../src/nacl.ts';

Deno.test('sealedbox.quick', () => {
    Deno.test('sealedbox and sealedbox_open', () => {
        const keyPair = box_keyPair();

        const msg = decodeUTF8('message to encrypt');
        const box = sealedbox(msg, keyPair.publicKey);
        const outMsg = sealedbox_open(box, keyPair.publicKey, keyPair.secretKey);

        assertNotEquals(outMsg, undefined);
        assertEquals(encodeUTF8(outMsg as ByteArray), encodeUTF8(msg));
    });

    Deno.test('sealedbox_open with invalid box', () => {
        const keyPair = box_keyPair();
        assertEquals(sealedbox_open(ByteArray(0), keyPair.publicKey, keyPair.secretKey), undefined);
        assertEquals(sealedbox_open(ByteArray(10), keyPair.publicKey, keyPair.secretKey), undefined);
        assertEquals(sealedbox_open(ByteArray(100), keyPair.publicKey, keyPair.secretKey), undefined);
    });

    Deno.test('sealedbox_open with invalid keys', () => {
        const keyPair = box_keyPair();
        const msg = decodeUTF8('message to encrypt');

        const realBox = sealedbox(msg, keyPair.publicKey);
        const unboxedMsg = sealedbox_open(realBox, keyPair.publicKey, keyPair.secretKey);
        assertNotEquals(unboxedMsg, undefined);
        assertEquals(encodeUTF8(unboxedMsg as ByteArray), encodeUTF8(msg));

        const badPublicKey = ByteArray(BoxLength.PublicKey);
        assertEquals(sealedbox_open(realBox, badPublicKey, keyPair.secretKey), undefined);

        const badSecretKey = ByteArray(BoxLength.SecretKey);
        assertEquals(sealedbox_open(realBox, keyPair.publicKey, badSecretKey), undefined);
    });
});
