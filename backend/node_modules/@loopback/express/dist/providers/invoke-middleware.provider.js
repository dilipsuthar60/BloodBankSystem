"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvokeMiddlewareProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const debug = (0, debug_1.default)('loopback:rest:middleware');
/**
 * Extension point for middleware to be run as part of the sequence actions
 */
let InvokeMiddlewareProvider = class InvokeMiddlewareProvider {
    static value(
    /**
     * Inject the binding so that we can access `extensionPoint` tag
     */
    binding, 
    /**
     * Default options for invoking the middleware chain
     */
    defaultOptions = {
        chain: types_1.DEFAULT_MIDDLEWARE_CHAIN,
        orderedGroups: ['cors', 'apiSpec', keys_1.DEFAULT_MIDDLEWARE_GROUP],
    }) {
        debug('Binding', binding);
        debug('Default options', defaultOptions);
        const invokeMiddlewareFn = (middlewareCtx, optionsOrHandlers) => {
            var _a;
            if (Array.isArray(optionsOrHandlers)) {
                return this.action(middlewareCtx, optionsOrHandlers);
            }
            const options = optionsOrHandlers;
            let chain = options === null || options === void 0 ? void 0 : options.chain;
            const orderedGroups = options === null || options === void 0 ? void 0 : options.orderedGroups;
            chain =
                (_a = chain !== null && chain !== void 0 ? chain : binding === null || binding === void 0 ? void 0 : binding.tagMap[core_1.CoreTags.EXTENSION_POINT]) !== null && _a !== void 0 ? _a : defaultOptions.chain;
            const middlewareOptions = {
                ...options,
                chain,
                orderedGroups: orderedGroups !== null && orderedGroups !== void 0 ? orderedGroups : defaultOptions.orderedGroups,
            };
            debug('Invoke middleware with', middlewareOptions);
            return this.action(middlewareCtx, middlewareOptions);
        };
        return invokeMiddlewareFn;
    }
    static async action(middlewareCtx, optionsOrHandlers) {
        if (Array.isArray(optionsOrHandlers)) {
            return (0, middleware_1.invokeExpressMiddleware)(middlewareCtx, ...optionsOrHandlers);
        }
        return (0, middleware_1.invokeMiddleware)(middlewareCtx, optionsOrHandlers);
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject.binding()),
    tslib_1.__param(1, (0, core_1.config)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Binding, Object]),
    tslib_1.__metadata("design:returntype", Function)
], InvokeMiddlewareProvider, "value", null);
InvokeMiddlewareProvider = tslib_1.__decorate([
    (0, core_1.extensionPoint)(types_1.DEFAULT_MIDDLEWARE_CHAIN)
], InvokeMiddlewareProvider);
exports.InvokeMiddlewareProvider = InvokeMiddlewareProvider;
//# sourceMappingURL=invoke-middleware.provider.js.map