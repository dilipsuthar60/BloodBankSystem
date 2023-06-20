"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMiddlewareRegistry = void 0;
const core_1 = require("@loopback/core");
const middleware_mixin_1 = require("./mixins/middleware.mixin");
/**
 * Base Context that provides APIs to register middleware
 */
class BaseMiddlewareRegistry extends (0, middleware_mixin_1.MiddlewareMixin)(core_1.Context) {
}
exports.BaseMiddlewareRegistry = BaseMiddlewareRegistry;
//# sourceMappingURL=middleware-registry.js.map