import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { ByteArray, encodeBase64, decodeBase64, encodeUTF8, decodeUTF8, encodeHex, decodeHex } from '../src/nacl.ts';

import base64RandomVectors from './data/base64.random.ts';

Deno.test('convert', () => {
    Deno.test('base64', () => {
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
            Deno.test(`good encode ${i}`, () => {
                assertEquals(encodeBase64(ByteArray(b)), s);
            });
            Deno.test(`good decode ${i}`, () => {
                assertEquals(decodeBase64(s), ByteArray(b));
            });
        });

        badVectors.forEach((b, i) => {
            Deno.test(`bad decode ${i}`, () => {
                assertThrows(() => decodeBase64(b));
            });
        });
    });

    // TODO: Fix test
    /*Deno.test('base64.random', () => {
        base64RandomVectors.forEach(([b, s], i) => {
            Deno.test(`encode ${i}`, () => {
                assertEquals(encodeBase64(ByteArray(b)), s);
            });
            Deno.test(`decode ${i}`, () => {
                assertEquals(decodeBase64(s), ByteArray(b));
            });
        });
    });*/

    Deno.test('utf8', () => {
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
            Deno.test(`encode ${i}`, () => {
                assertEquals(encodeUTF8(ByteArray(b)), s);
            });
            Deno.test(`decode ${i}`, () => {
                assertEquals(decodeUTF8(s), ByteArray(b));
            });
        });
    });

    Deno.test('hex', () => {
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
            Deno.test(`good encode ${i}`, () => {
                assertEquals(encodeHex(ByteArray(b)), s.toLowerCase());
            });
            Deno.test(`good decode ${i}`, () => {
                assertEquals(decodeHex(s), ByteArray(b));
            });
        });

        badVectors.forEach((b, i) => {
            Deno.test(`bad decode ${i}`, () => {
                assertThrows(() => decodeHex(b));
            });
        });
    });
});
