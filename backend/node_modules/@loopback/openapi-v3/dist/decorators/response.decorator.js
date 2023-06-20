"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const http_status_1 = tslib_1.__importDefault(require("http-status"));
const keys_1 = require("../keys");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponseObject(c) {
    return (c != null &&
        Object.prototype.hasOwnProperty.call(c, 'content') &&
        c.content != null);
}
function buildDecoratorReducer(responseCode, description, contentType = 'application/json') {
    const decoratorItemReducer = (r, m) => {
        var _a;
        // allow { content: { 'application/json': {...}}}
        if (isResponseObject(m)) {
            Object.keys((_a = m.content) !== null && _a !== void 0 ? _a : {}).forEach(ct => {
                var _a;
                r.push({
                    responseCode,
                    responseModelOrSpec: m.content[ct].schema,
                    contentType: ct,
                    description: (_a = m.description) !== null && _a !== void 0 ? _a : description,
                });
            });
        }
        else {
            r.push({
                responseCode,
                responseModelOrSpec: m,
                // we're defaulting these for convenience for now.
                contentType,
                description,
            });
        }
        return r;
    };
    return decoratorItemReducer;
}
/**
 * Add response object to a path spec.
 * @param responseCode - The HTTP response code.
 * @param responseModelOrSpec - The corresponding response object. Or the model
 *        type used to generate the response object.
 *
 * @example
 * ```ts
 * class MyController {
 *   @get('/greet')
 *   @oas.response(200, SuccessModel)
 *   @oas.response(404, OneError, { $ref: '#/definition...'})
 *   @oas.response(403, SecondError, { schema: ... })
 *   greet() {
 *     return new SuccessModel({message: 'Hello, world'});
 *   }
 * }
 * ```
 */
function response(responseCode, ...responseModelOrSpec) {
    const messageKey = String(responseCode);
    return core_1.MethodMultiDecoratorFactory.createDecorator(keys_1.OAI3Keys.RESPONSE_METHOD_KEY, responseModelOrSpec.reduce(buildDecoratorReducer(responseCode, http_status_1.default[messageKey]), []), { decoratorName: '@response', allowInheritance: false });
}
exports.response = response;
(function (response) {
    /**
     * Decorate the response as a file
     *
     * @example
     * ```ts
     * import {oas, get, param} from '@loopback/openapi-v3';
     * import {RestBindings, Response} from '@loopback/rest';
     *
     * class MyController {
     *   @get('/files/{filename}')
     *   @oas.response.file('image/jpeg', 'image/png')
     *   download(
     *     @param.path.string('filename') fileName: string,
     *     @inject(RestBindings.Http.RESPONSE) response: Response,
     *   ) {
     *     // use response.download(...);
     *   }
     * }
     * ```
     * @param mediaTypes - A list of media types for the file response. It's
     * default to `['application/octet-stream']`.
     */
    response.file = (...mediaTypes) => {
        if (mediaTypes.length === 0) {
            mediaTypes = ['application/octet-stream'];
        }
        const responseWithContent = {
            content: {},
            description: 'The file content',
        };
        for (const t of mediaTypes) {
            responseWithContent.content[t] = {
                schema: {
                    type: 'string',
                    format: 'binary', // This is required by OpenAPI spec 3.x
                },
            };
        }
        return response(200, responseWithContent);
    };
})(response = exports.response || (exports.response = {}));
//# sourceMappingURL=response.decorator.js.map