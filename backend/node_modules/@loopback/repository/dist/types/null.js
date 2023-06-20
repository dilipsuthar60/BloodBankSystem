"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullType = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Null type
 */
class NullType {
    constructor() {
        this.name = 'boolean';
    }
    isInstance(value) {
        return value === null;
    }
    defaultValue() {
        return null;
    }
    isCoercible(value) {
        return value == null;
    }
    coerce(value) {
        return null;
    }
    serialize(value) {
        return null;
    }
}
exports.NullType = NullType;
//# sourceMappingURL=null.js.map