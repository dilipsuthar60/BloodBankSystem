"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL = exports.ANY = exports.BUFFER = exports.DATE = exports.NUMBER = exports.BOOLEAN = exports.STRING = exports.ObjectType = exports.NullType = exports.ModelType = exports.UnionType = exports.ArrayType = exports.AnyType = exports.BufferType = exports.DateType = exports.NumberType = exports.BooleanType = exports.StringType = void 0;
/**
 * Built-in types for LoopBack modeling
 * - Type: abstract base type
 * - StringType: string
 * - BooleanType: boolean
 * - NumberType: number
 * - DateType: Date
 * - BufferType: Buffer
 * - AnyType: any
 * - ArrayType: Array<T>
 * - UnionType: Union of types
 */
const any_1 = require("./any");
Object.defineProperty(exports, "AnyType", { enumerable: true, get: function () { return any_1.AnyType; } });
const array_1 = require("./array");
Object.defineProperty(exports, "ArrayType", { enumerable: true, get: function () { return array_1.ArrayType; } });
const boolean_1 = require("./boolean");
Object.defineProperty(exports, "BooleanType", { enumerable: true, get: function () { return boolean_1.BooleanType; } });
const buffer_1 = require("./buffer");
Object.defineProperty(exports, "BufferType", { enumerable: true, get: function () { return buffer_1.BufferType; } });
const date_1 = require("./date");
Object.defineProperty(exports, "DateType", { enumerable: true, get: function () { return date_1.DateType; } });
const model_1 = require("./model");
Object.defineProperty(exports, "ModelType", { enumerable: true, get: function () { return model_1.ModelType; } });
const null_1 = require("./null");
Object.defineProperty(exports, "NullType", { enumerable: true, get: function () { return null_1.NullType; } });
const number_1 = require("./number");
Object.defineProperty(exports, "NumberType", { enumerable: true, get: function () { return number_1.NumberType; } });
const object_1 = require("./object");
Object.defineProperty(exports, "ObjectType", { enumerable: true, get: function () { return object_1.ObjectType; } });
const string_1 = require("./string");
Object.defineProperty(exports, "StringType", { enumerable: true, get: function () { return string_1.StringType; } });
const union_1 = require("./union");
Object.defineProperty(exports, "UnionType", { enumerable: true, get: function () { return union_1.UnionType; } });
exports.STRING = new string_1.StringType();
exports.BOOLEAN = new boolean_1.BooleanType();
exports.NUMBER = new number_1.NumberType();
exports.DATE = new date_1.DateType();
exports.BUFFER = new buffer_1.BufferType();
exports.ANY = new any_1.AnyType();
exports.NULL = new null_1.NullType();
//# sourceMappingURL=index.js.map