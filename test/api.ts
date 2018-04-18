import { throws } from 'assert';

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
} from '../src/nacl';

const nonce = ByteArray(SecretBoxLength.Nonce);
const key = ByteArray(SecretBoxLength.Key);
const msg = ByteArray(10);

const arr = [1, 2, 3] as any as ByteArray;

describe('api', () => {
    describe('input type check', () => {
        it('secretbox', () => {
            throws(() => { secretbox(arr, nonce, key); }, TypeError);
            throws(() => { secretbox(msg, arr, key); }, TypeError);
            throws(() => { secretbox(msg, nonce, arr); }, TypeError);
        });

        it('secretbox_open', () => {
            throws(() => { secretbox_open(arr, nonce, key); }, TypeError);
            throws(() => { secretbox_open(msg, arr, key); }, TypeError);
            throws(() => { secretbox_open(msg, nonce, arr); }, TypeError);
        });

        it('scalarMult', () => {
            throws(() => { scalarMult(arr, key); }, TypeError);
            throws(() => { scalarMult(key, arr); }, TypeError);
        });

        it('scalarMult_base', () => {
            throws(() => { scalarMult_base(arr); }, TypeError);
        });

        it('box', () => {
            throws(() => { box(arr, nonce, key, key); }, TypeError);
            throws(() => { box(msg, arr, key, key); }, TypeError);
            throws(() => { box(msg, nonce, arr, key); }, TypeError);
            throws(() => { box(msg, nonce, key, arr); }, TypeError);
        });

        it('box_open', () => {
            throws(() => { box_open(arr, nonce, key, key); }, TypeError);
            throws(() => { box_open(msg, arr, key, key); }, TypeError);
            throws(() => { box_open(msg, nonce, arr, key); }, TypeError);
            throws(() => { box_open(msg, nonce, key, arr); }, TypeError);
        });

        it('box_before', () => {
            throws(() => { box_before(arr, key); }, TypeError);
            throws(() => { box_before(key, arr); }, TypeError);
        });

        it('box_after', () => {
            throws(() => { box_after(arr, nonce, key); }, TypeError);
            throws(() => { box_after(msg, arr, key); }, TypeError);
            throws(() => { box_after(msg, nonce, arr); }, TypeError);
        });

        it('box_open_after', () => {
            throws(() => { box_open_after(arr, nonce, key); }, TypeError);
            throws(() => { box_open_after(msg, arr, key); }, TypeError);
            throws(() => { box_open_after(msg, nonce, arr); }, TypeError);
        });

        it('box_keyPair_fromSecretKey', () => {
            throws(() => { box_keyPair_fromSecretKey(arr); }, TypeError);
        });

        it('sign', () => {
            throws(() => { sign(arr, key); }, TypeError);
            throws(() => { sign(msg, arr); }, TypeError);
        });

        it('sign_open', () => {
            throws(() => { sign_open(arr, key); }, TypeError);
            throws(() => { sign_open(msg, arr); }, TypeError);
        });

        it('sign_detached', () => {
            throws(() => { sign_detached(arr, key); }, TypeError);
            throws(() => { sign_detached(msg, arr); }, TypeError);
        });

        it('sign_detached_verify', () => {
            throws(() => { sign_detached_verify(arr, key, key); }, TypeError);
            throws(() => { sign_detached_verify(msg, arr, key); }, TypeError);
            throws(() => { sign_detached_verify(msg, key, arr); }, TypeError);
        });

        it('sign_keyPair_fromSecretKey', () => {
            throws(() => { sign_keyPair_fromSecretKey(arr); }, TypeError);
        });

        it('sign_keyPair_fromSeed', () => {
            throws(() => { sign_keyPair_fromSeed(arr); }, TypeError);
        });

        it('hash', () => {
            throws(() => { hash(arr); }, TypeError);
        });

        it('verify', () => {
            throws(() => { verify(arr, msg); }, TypeError);
            throws(() => { verify(msg, arr); }, TypeError);
        });
    });
});
