"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.openapiFormats = exports.binaryFormat = exports.byteFormat = exports.doubleFormat = exports.floatFormat = exports.int64Format = exports.int32Format = void 0;
/**
 * int32: [-2147483648, 21474836 47]
 */
exports.int32Format = {
    name: 'int32',
    type: 'number',
    validate: (value) => {
        return (Number.isInteger(value) && value >= -2147483648 && value <= 2147483647);
    },
    async: false,
};
/**
 * int64: [-9223372036854775808, 9223372036854775807]
 */
exports.int64Format = {
    name: 'int64',
    type: 'number',
    validate: (value) => {
        const max = Number.MAX_SAFE_INTEGER; // 9007199254740991
        const min = Number.MIN_SAFE_INTEGER; // -9007199254740991
        return Number.isInteger(value) && value >= min && value <= max;
    },
    async: false,
};
/**
 * float: [-2^128, 2^128]
 */
exports.floatFormat = {
    name: 'float',
    type: 'number',
    validate: (value) => {
        return value >= -Math.pow(2, 128) && value <= Math.pow(2, 128);
    },
    async: false,
};
/**
 * double: [-2^1024, 2^1024]
 */
exports.doubleFormat = {
    name: 'double',
    type: 'number',
    validate: (value) => {
        const max = Number.MAX_VALUE; // 1.7976931348623157e+308
        const min = -Number.MAX_VALUE; // -1.7976931348623157e+308
        return value >= min && value <= max;
    },
    async: false,
};
/**
 * Base64 encoded string
 */
exports.byteFormat = {
    name: 'byte',
    type: 'string',
    validate: (value) => {
        const base64 = Buffer.from(value, 'base64').toString('base64');
        return value === base64;
    },
    async: false,
};
/**
 * Binary string
 */
exports.binaryFormat = {
    name: 'binary',
    type: 'string',
    validate: (value) => true,
    async: false,
};
exports.openapiFormats = [
    exports.int32Format,
    exports.int64Format,
    exports.floatFormat,
    exports.doubleFormat,
    exports.byteFormat,
    exports.binaryFormat,
];
//# sourceMappingURL=openapi-formats.js.map