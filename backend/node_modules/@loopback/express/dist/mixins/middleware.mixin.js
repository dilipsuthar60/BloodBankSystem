"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareMixin = void 0;
const core_1 = require("@loopback/core");
const middleware_1 = require("../middleware");
/* eslint-enable @typescript-eslint/no-unused-vars */
function extendsFrom(subClass, baseClass) {
    let cls = subClass;
    while (cls) {
        if (cls === baseClass)
            return true;
        cls = Object.getPrototypeOf(cls);
    }
    return false;
}
function MiddlewareMixin(superClass) {
    if (!extendsFrom(superClass, core_1.Context)) {
        throw new TypeError('The super class does not extend from Context');
    }
    return class extends superClass {
        /**
         * @internal
         * Implementation of `expressMiddleware`
         */
        expressMiddleware(factoryOrKey, configOrHandlers, options = {}) {
            const key = factoryOrKey;
            if ((0, core_1.isBindingAddress)(key)) {
                const handlers = Array.isArray(configOrHandlers)
                    ? configOrHandlers
                    : [configOrHandlers];
                // Create middleware that wraps all Express handlers
                if (handlers.length === 0) {
                    throw new Error('No Express middleware handler function is provided.');
                }
                return (0, middleware_1.registerMiddleware)(this, (0, middleware_1.toMiddleware)(handlers[0], ...handlers.slice(1)), {
                    ...options,
                    key,
                });
            }
            else {
                return (0, middleware_1.registerExpressMiddleware)(this, factoryOrKey, configOrHandlers, options);
            }
        }
        /**
         * Register a middleware function or provider class
         *
         * @example
         * ```ts
         * const log: Middleware = async (requestCtx, next) {
         *   // ...
         * }
         * server.middleware(log);
         * ```
         *
         * @param middleware - Middleware function or provider class
         * @param options - Middleware binding options
         */
        middleware(middleware, options = {}) {
            return (0, middleware_1.registerMiddleware)(this, middleware, options);
        }
    };
}
exports.MiddlewareMixin = MiddlewareMixin;
//# sourceMappingURL=middleware.mixin.js.map