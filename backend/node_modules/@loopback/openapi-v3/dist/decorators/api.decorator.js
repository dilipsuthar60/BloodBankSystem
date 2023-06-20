"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
/**
 * Decorate the given Controller constructor with metadata describing
 * the HTTP/REST API the Controller implements/provides.
 *
 * `@api` can be applied to controller classes.
 *
 * @example
 *
 * ```ts
 * @api({basePath: '/my'})
 * class MyController {
 *   // ...
 * }
 * ```
 *
 * @param spec - OpenAPI specification describing the endpoints
 * handled by this controller
 *
 */
function api(spec) {
    const controllerSpec = { paths: {}, ...spec };
    return core_1.ClassDecoratorFactory.createDecorator(keys_1.OAI3Keys.CLASS_KEY, controllerSpec, { decoratorName: '@api' });
}
exports.api = api;
//# sourceMappingURL=api.decorator.js.map