"use strict";
// Copyright IBM Corp. 2017,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountSchema = void 0;
/**
 * JSON Schema describing the Count interface. It's the response type for
 * REST calls to APIs which return `count`. The type is compatible with
 * `SchemaObject` from `@loopback/openapi-v3`, which is not an explicit
 * dependency for `@loopback/repository`.
 */
exports.CountSchema /* :SchemaObject */ = {
    type: 'object',
    title: 'loopback.Count',
    'x-typescript-type': '@loopback/repository#Count',
    properties: {
        count: {
            type: 'number', // Force to be `number` type instead of `string`
        },
    },
};
//# sourceMappingURL=common-types.js.map