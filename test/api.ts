import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

import {
    ByteArray,

    scalarMult,
    scalarMult_base,

    SecretBoxLength,
    secretbox,
    secretbox_open,

    box,
    box_open,
    box_before,
    box_after,
    box_open_after,
    box_keyPair_fromSecretKey,

    sign,
    sign_open,
    sign_detached,
    sign_detached_verify,
    sign_keyPair_fromSecretKey,
    sign_keyPair_fromSeed,

    hash,
    verify
} from '../src/nacl.ts';

const nonce = ByteArray(SecretBoxLength.Nonce);
const key = ByteArray(SecretBoxLength.Key);
const msg = ByteArray(10);

const arr = [1, 2, 3] as any as ByteArray;

Deno.test('api', () => {
    Deno.test('input type check', () => {
        Deno.test('secretbox', () => {
            assertThrows(() => { secretbox(arr, nonce, key); }, TypeError);
            assertThrows(() => { secretbox(msg, arr, key); }, TypeError);
            assertThrows(() => { secretbox(msg, nonce, arr); }, TypeError);
        });

        Deno.test('secretbox_open', () => {
            assertThrows(() => { secretbox_open(arr, nonce, key); }, TypeError);
            assertThrows(() => { secretbox_open(msg, arr, key); }, TypeError);
            assertThrows(() => { secretbox_open(msg, nonce, arr); }, TypeError);
        });

        Deno.test('scalarMult', () => {
            assertThrows(() => { scalarMult(arr, key); }, TypeError);
            assertThrows(() => { scalarMult(key, arr); }, TypeError);
        });

        Deno.test('scalarMult_base', () => {
            assertThrows(() => { scalarMult_base(arr); }, TypeError);
        });

        Deno.test('box', () => {
            assertThrows(() => { box(arr, nonce, key, key); }, TypeError);
            assertThrows(() => { box(msg, arr, key, key); }, TypeError);
            assertThrows(() => { box(msg, nonce, arr, key); }, TypeError);
            assertThrows(() => { box(msg, nonce, key, arr); }, TypeError);
        });

        Deno.test('box_open', () => {
            assertThrows(() => { box_open(arr, nonce, key, key); }, TypeError);
            assertThrows(() => { box_open(msg, arr, key, key); }, TypeError);
            assertThrows(() => { box_open(msg, nonce, arr, key); }, TypeError);
            assertThrows(() => { box_open(msg, nonce, key, arr); }, TypeError);
        });

        Deno.test('box_before', () => {
            assertThrows(() => { box_before(arr, key); }, TypeError);
            assertThrows(() => { box_before(key, arr); }, TypeError);
        });

        Deno.test('box_after', () => {
            assertThrows(() => { box_after(arr, nonce, key); }, TypeError);
            assertThrows(() => { box_after(msg, arr, key); }, TypeError);
            assertThrows(() => { box_after(msg, nonce, arr); }, TypeError);
        });

        Deno.test('box_open_after', () => {
            assertThrows(() => { box_open_after(arr, nonce, key); }, TypeError);
            assertThrows(() => { box_open_after(msg, arr, key); }, TypeError);
            assertThrows(() => { box_open_after(msg, nonce, arr); }, TypeError);
        });

        Deno.test('box_keyPair_fromSecretKey', () => {
            assertThrows(() => { box_keyPair_fromSecretKey(arr); }, TypeError);
        });

        Deno.test('sign', () => {
            assertThrows(() => { sign(arr, key); }, TypeError);
            assertThrows(() => { sign(msg, arr); }, TypeError);
        });

        Deno.test('sign_open', () => {
            assertThrows(() => { sign_open(arr, key); }, TypeError);
            assertThrows(() => { sign_open(msg, arr); }, TypeError);
        });

        Deno.test('sign_detached', () => {
            assertThrows(() => { sign_detached(arr, key); }, TypeError);
            assertThrows(() => { sign_detached(msg, arr); }, TypeError);
        });

        Deno.test('sign_detached_verify', () => {
            assertThrows(() => { sign_detached_verify(arr, key, key); }, TypeError);
            assertThrows(() => { sign_detached_verify(msg, arr, key); }, TypeError);
            assertThrows(() => { sign_detached_verify(msg, key, arr); }, TypeError);
        });

        Deno.test('sign_keyPair_fromSecretKey', () => {
            assertThrows(() => { sign_keyPair_fromSecretKey(arr); }, TypeError);
        });

        Deno.test('sign_keyPair_fromSeed', () => {
            assertThrows(() => { sign_keyPair_fromSeed(arr); }, TypeError);
        });

        Deno.test('hash', () => {
            assertThrows(() => { hash(arr); }, TypeError);
        });

        Deno.test('verify', () => {
            assertThrows(() => { verify(arr, msg); }, TypeError);
            assertThrows(() => { verify(msg, arr); }, TypeError);
        });
    });
});
