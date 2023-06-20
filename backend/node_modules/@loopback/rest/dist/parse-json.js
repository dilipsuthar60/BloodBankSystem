"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJson = exports.sanitizeJsonParse = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
// These utilities are introduced to mitigate the prototype pollution issue
// with `JSON.parse`.
// See https://hueniverse.com/a-tale-of-prototype-poisoning-2610fa170061
//
// The [bourne](https://github.com/hapijs/bourne) module provides a drop-in
// replacement for `JSON.parse` but we need to instruct `body-parser` to honor
// a `reviver` function.
const isMatched = (key, pattern) => pattern === key || key.indexOf(`${pattern}.`) === 0;
/**
 * Factory to create a reviver function for `JSON.parse` to sanitize keys
 * @param reviver - Reviver function
 * @param prohibitedKeys - An array of keys to be rejected
 */
function sanitizeJsonParse(reviver, prohibitedKeys) {
    return (key, value) => {
        if (key === '__proto__') {
            // Reject `__proto__`
            throw new Error(`JSON string cannot contain "${key}" key.`);
        }
        if (key === 'constructor' &&
            value != null &&
            Object.keys(value).some(k => isMatched(k, 'prototype'))) {
            // Reject `constructor/prototype.*`
            throw new Error(`JSON string cannot contain "constructor.prototype" key.`);
        }
        if (prohibitedKeys === null || prohibitedKeys === void 0 ? void 0 : prohibitedKeys.some(pattern => isMatched(key, pattern))) {
            throw new Error(`JSON string cannot contain "${key}" key.`);
        }
        if (reviver) {
            return reviver(key, value);
        }
        else {
            return value;
        }
    };
}
exports.sanitizeJsonParse = sanitizeJsonParse;
/**
 * Parse a json string that rejects prohibited keys
 * @param text - JSON string
 * @param reviver - Optional reviver function for `JSON.parse`
 * @param prohibitedKeys - An array of keys to be rejected
 */
function parseJson(text, reviver, prohibitedKeys) {
    prohibitedKeys = [
        '__proto__',
        'constructor.prototype',
        ...(prohibitedKeys !== null && prohibitedKeys !== void 0 ? prohibitedKeys : []),
    ];
    return JSON.parse(text, sanitizeJsonParse(reviver, prohibitedKeys));
}
exports.parseJson = parseJson;
//# sourceMappingURL=parse-json.js.map