import { assert, assertEquals, assertNotEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import {
    ByteArray,
    randomBytes,
    SignLength,
    sign,
    sign_open,
    sign_keyPair,
    sign_keyPair_fromSecretKey,
    sign_keyPair_fromSeed,
    sign_detached,
    sign_detached_verify,
    encodeBase64 as enc
} from '../src/nacl.ts';

Deno.test('sign.quick', () => {
    Deno.test('sign_keyPair', () => {
        const keys = sign_keyPair();
        assert(keys.secretKey && keys.secretKey.length === SignLength.SecretKey, 'has secret key');
        assert(keys.publicKey && keys.publicKey.length === SignLength.PublicKey, 'has public key');
        assertNotEquals(enc(keys.secretKey), enc(keys.publicKey));

        const newKeys = sign_keyPair();
        assertNotEquals(enc(newKeys.secretKey), enc(keys.secretKey), 'two keys differ');
    });

    Deno.test('sign_keyPair_fromSecretKey', () => {
        const k1 = sign_keyPair();
        const k2 = sign_keyPair_fromSecretKey(k1.secretKey);

        assertEquals(enc(k2.secretKey), enc(k1.secretKey));
        assertEquals(enc(k2.publicKey), enc(k1.publicKey));
    });

    Deno.test('sign_keyPair_fromSeed', () => {
        const seed = randomBytes(SignLength.Seed);
        const k1 = sign_keyPair_fromSeed(seed);
        const k2 = sign_keyPair_fromSeed(seed);
        assertEquals(k1.secretKey.length, SignLength.SecretKey);
        assertEquals(k1.publicKey.length, SignLength.PublicKey);
        assertEquals(k2.secretKey.length, SignLength.SecretKey);
        assertEquals(k2.publicKey.length, SignLength.PublicKey);
        assertEquals(enc(k2.secretKey), enc(k1.secretKey));
        assertEquals(enc(k2.publicKey), enc(k1.publicKey));

        const seed2 = randomBytes(SignLength.Seed);
        const k3 = sign_keyPair_fromSeed(seed2);
        assertEquals(k3.secretKey.length, SignLength.SecretKey);
        assertEquals(k3.publicKey.length, SignLength.PublicKey);
        assertNotEquals(enc(k3.secretKey), enc(k1.secretKey));
        assertNotEquals(enc(k3.publicKey), enc(k1.publicKey));
        assertThrows(() => { sign_keyPair_fromSeed(seed2.subarray(0, 16)); }, Error, 'should throw error for wrong seed size');
    });

    Deno.test('sign and sign_open', () => {
        const k = sign_keyPair();
        const m = ByteArray(100);

        let i;
        for (i = 0; i < m.length; i++) m[i] = i & 0xff;

        const sm = sign(m, k.secretKey);
        assert(sm.length > m.length, 'signed message length should be greater than message length');

        let om = sign_open(sm, k.publicKey);
        assertEquals(om, m);

        assertThrows(() => { sign_open(sm, k.publicKey.subarray(1)); }, Error, 'throws error for wrong public key size');

        const badPublicKey = ByteArray(k.publicKey.length);
        om = sign_open(sm, badPublicKey);
        assertEquals(om, null, 'opened message must be null when using wrong public key');

        for (i = 80; i < 90; i++) sm[i] = 0;
        om = sign_open(sm, k.publicKey);
        assertEquals(om, null, 'opened message must be null when opening bad signed message');
    });

    Deno.test('sign.detached and sign_detached_verify', () => {
        const k = sign_keyPair();
        const m = ByteArray(100);
        let i;
        for (i = 0; i < m.length; i++) m[i] = i & 0xff;

        const sig = sign_detached(m, k.secretKey);
        assert(sig.length === SignLength.Signature, 'signature must have correct length');

        let result = sign_detached_verify(m, sig, k.publicKey);
        assert(result, 'signature must be verified');

        assertThrows(() => { sign_detached_verify(m, sig, k.publicKey.subarray(1)); }, Error, 'throws error for wrong public key size');
        assertThrows(() => { sign_detached_verify(m, sig.subarray(1), k.publicKey); }, Error, 'throws error for wrong signature size');

        const badPublicKey = ByteArray(k.publicKey.length);
        result = sign_detached_verify(m, sig, badPublicKey);
        assertEquals(result, false, 'signature must not be verified with wrong public key');

        for (i = 0; i < 10; i++) sig[i] = 0;
        result = sign_detached_verify(m, sig, k.publicKey);
        assertEquals(result, false, 'bad signature must not be verified');
    });
});
