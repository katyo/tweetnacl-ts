import { equal, deepEqual, throws } from 'assert';
import { ByteArray, encodeBase64, decodeBase64, encodeUTF8, decodeUTF8, encodeHex, decodeHex } from '../src/nacl';

import base64RandomVectors from './data/base64.random';

describe('convert', () => {
    describe('base64', () => {
        const goodVectors: [number[], string][] = [
            // https://tools.ietf.org/html/rfc4648
            [[], ""],
            [[102], "Zg=="],
            [[102, 111], "Zm8="],
            [[102, 111, 111], "Zm9v"],
            [[102, 111, 111, 98], "Zm9vYg=="],
            [[102, 111, 111, 98, 97], "Zm9vYmE="],
            [[102, 111, 111, 98, 97, 114], "Zm9vYmFy"],
            // "hello world"
            [[104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100], "aGVsbG8gd29ybGQ="],
            // zeros
            [[0], "AA=="],
            [[0, 0], "AAA="],
            [[0, 0, 0], "AAAA"],
            [[0, 0, 0, 0], "AAAAAA=="],
            [[0, 0, 0, 0, 0], "AAAAAAA="],
            [[0, 0, 0, 0, 0, 0], "AAAAAAAA"],
            // random
            [
                [111, 16, 164, 40, 38, 216, 61, 120, 247, 118, 115, 82, 77, 65, 170, 155],
                "bxCkKCbYPXj3dnNSTUGqmw=="
            ],
            [
                [216, 8, 213, 125, 61, 133, 254, 192, 132, 229, 47, 151, 14, 63, 142, 230, 59, 143, 232, 228],
                "2AjVfT2F/sCE5S+XDj+O5juP6OQ="
            ]
        ];

        const badVectors: string[] = [
            "=",
            "==",
            "Zg===",
            "AAA",
            "=Zm8",
            "что"
        ];

        goodVectors.forEach(([b, s], i) => {
            it(`good encode ${i}`, () => {
                equal(encodeBase64(ByteArray(b)), s);
            });
            it(`good decode ${i}`, () => {
                deepEqual(decodeBase64(s), ByteArray(b));
            });
        });

        badVectors.forEach((b, i) => {
            it(`bad decode ${i}`, () => {
                throws(() => decodeBase64(b));
            });
        });
    });

    describe('base64.random', () => {
        base64RandomVectors.forEach(([b, s]: [number[], string], i) => {
            it(`encode ${i}`, () => {
                equal(encodeBase64(ByteArray(b)), s);
            });
            it(`decode ${i}`, () => {
                deepEqual(decodeBase64(s), ByteArray(b));
            });
        });
    });

    describe('utf8', () => {
        const testVectors: [string, number[]][] = [
            ["abcdef", [97, 98, 99, 100, 101, 102]],
            ["☺☻☹", [226, 152, 186, 226, 152, 187, 226, 152, 185]],
            ["абвгдеёжз", [208, 176, 208, 177, 208, 178, 208, 179, 208, 180, 208, 181, 209, 145, 208, 182, 208, 183]],
            ["abcгдеjzy123", [97, 98, 99, 208, 179, 208, 180, 208, 181, 106, 122, 121, 49, 50, 51]],
            ["こんにちは世界", [227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175, 228, 184, 150, 231, 149, 140]],
            ["test 测试 тест", [116, 101, 115, 116, 32, 230, 181, 139, 232, 175, 149, 32, 209, 130, 208, 181, 209, 129, 209, 130]],
            ["𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡", [240, 157, 159, 152, 240, 157, 159, 153, 240, 157, 159, 154, 240, 157, 159, 155, 240, 157, 159, 156, 240, 157, 159, 157, 240, 157, 159, 158, 240, 157, 159, 159, 240, 157, 159, 160, 240, 157, 159, 161]]
        ];

        testVectors.forEach(([s, b], i) => {
            it(`encode ${i}`, () => {
                equal(encodeUTF8(ByteArray(b)), s);
            });
            it(`decode ${i}`, () => {
                deepEqual(decodeUTF8(s), ByteArray(b));
            });
        });
    });

    describe('hex', () => {
        const goodVectors: [string, number[]][] = [
            ["01", [1]],
            ["0a", [10]],
            ["0A", [10]],
            ["0123456789abcdef", [1, 35, 69, 103, 137, 171, 205, 239]],
            ["0123456789ABCDEF", [1, 35, 69, 103, 137, 171, 205, 239]],
            ["fedcba9876543210", [254, 220, 186, 152, 118, 84, 50, 16]],
            ["FEDCBA9876543210", [254, 220, 186, 152, 118, 84, 50, 16]]
        ];

        const badVectors: string[] = [
            "0",
            "012345678",
            "G",
            "fg",
            "FG",
            ",:!"
        ];

        goodVectors.forEach(([s, b], i) => {
            it(`good encode ${i}`, () => {
                equal(encodeHex(ByteArray(b)), s.toLowerCase());
            });
            it(`good decode ${i}`, () => {
                deepEqual(decodeHex(s), ByteArray(b));
            });
        });

        badVectors.forEach((b, i) => {
            it(`bad decode ${i}`, () => {
                throws(() => decodeHex(b));
            });
        });
    });
});
