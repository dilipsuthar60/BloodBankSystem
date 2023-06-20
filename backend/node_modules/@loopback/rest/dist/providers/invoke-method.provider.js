"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvokeMethodMiddlewareProvider = exports.InvokeMethodProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const express_1 = require("@loopback/express");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const sequence_1 = require("../sequence");
const debug = (0, debug_1.default)('loopback:rest:invoke-method');
class InvokeMethodProvider {
    static value(context) {
        const invokeMethod = (route, args) => route.invokeHandler(context, args);
        return invokeMethod;
    }
}
tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.Http.CONTEXT)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Context]),
    tslib_1.__metadata("design:returntype", Function)
], InvokeMethodProvider, "value", null);
exports.InvokeMethodProvider = InvokeMethodProvider;
let InvokeMethodMiddlewareProvider = class InvokeMethodMiddlewareProvider {
    value() {
        return async (ctx, next) => {
            const route = await ctx.get(keys_1.RestBindings.Operation.ROUTE);
            const params = await ctx.get(keys_1.RestBindings.Operation.PARAMS);
            if (debug.enabled) {
                debug('Invoking method %s with', route.describe(), params);
            }
            try {
                const retVal = await route.invokeHandler(ctx, params);
                ctx.bind(keys_1.RestBindings.Operation.RETURN_VALUE).to(retVal);
                if (debug.enabled) {
                    debug('Return value from %s', route.describe(), retVal);
                }
                return retVal;
            }
            catch (err) {
                if (debug.enabled) {
                    debug('Error thrown from %s', route.describe(), err);
                }
                throw err;
            }
        };
    }
};
InvokeMethodMiddlewareProvider = tslib_1.__decorate([
    (0, core_1.injectable)((0, express_1.asMiddleware)({
        group: sequence_1.RestMiddlewareGroups.INVOKE_METHOD,
        upstreamGroups: sequence_1.RestMiddlewareGroups.PARSE_PARAMS,
        chain: keys_1.RestTags.REST_MIDDLEWARE_CHAIN,
    }), { scope: core_1.BindingScope.SINGLETON })
], InvokeMethodMiddlewareProvider);
exports.InvokeMethodMiddlewareProvider = InvokeMethodMiddlewareProvider;
//# sourceMappingURL=invoke-method.provider.js.map