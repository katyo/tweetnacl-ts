import { ByteArray } from '../array';
import { validateBase64, validateHex } from '../validate';

const { fromCharCode } = String;

export function encodeUTF8(a: ByteArray): string {
    return decodeURIComponent(escape(fromCharCode.apply(undefined, a)));
}

export function decodeUTF8(s: string): ByteArray {
    if (typeof s !== 'string') throw new TypeError('expected string');

    const d = unescape(encodeURIComponent(s)), b = ByteArray(d.length);

    for (let i = 0; i < d.length; i++) {
        b[i] = d.charCodeAt(i);
    }

    return b;
}

export function encodeBase64(a: ByteArray): string {
    return btoa(fromCharCode.apply(undefined, a));
}

export function decodeBase64(s: string): ByteArray {
    validateBase64(s);

    const d = atob(s), b = ByteArray(d.length);

    for (let i = 0; i < d.length; i++) {
        b[i] = d.charCodeAt(i);
    }

    return b;
}

function put_hb(h: number) {
    return h + (h < 10 ? 48 : 87);
}

export function encodeHex(a: ByteArray): string {
    const b = ByteArray(a.length << 1);

    for (let i = 0, j; i < a.length; i++) {
        j = i << 1;
        b[j] = put_hb(a[i] >> 8);
        b[j + 1] = put_hb(a[i] & 0xf);
    }

    return fromCharCode.apply(undefined, b);
}

function get_hb(s: string, i: number): number {
    const c = s.charCodeAt(i);
    return c - (c < 58 ? 48 : c < 71 ? 55 : 87);
}

export function decodeHex(s: string): ByteArray {
    validateHex(s);

    const a: ByteArray = ByteArray(s.length >> 1);

    for (let i = 0; i < a.length; i += 2) {
        a[i] = (get_hb(s, i) << 8) | get_hb(s, i + 1);
    }

    return a;
}
