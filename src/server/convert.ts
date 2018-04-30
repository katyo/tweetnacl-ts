import { ByteArray } from '../array';
import { validateBase64, validateHex } from '../validate';

const { prototype: { slice } } = Array;

export function encodeUTF8(a: ByteArray): string {
    return Buffer.from(a).toString('utf8');
}

export function decodeUTF8(s: string): ByteArray {
    return ByteArray(slice.call(Buffer.from(s, 'utf8'), 0));
}

export function encodeBase64(a: ByteArray): string {
    return Buffer.from(a).toString('base64');
}

export function decodeBase64(s: string): ByteArray {
    validateBase64(s);

    return ByteArray(slice.call(Buffer.from(s, 'base64'), 0));
}

export function encodeHex(a: ByteArray): string {
    return Buffer.from(a).toString('hex');
}

export function decodeHex(s: string): ByteArray {
    validateHex(s);

    return ByteArray(slice.call(Buffer.from(s, 'hex'), 0));
}
