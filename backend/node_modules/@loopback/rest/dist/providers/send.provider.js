"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponseMiddlewareProvider = exports.SendProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const express_1 = require("@loopback/express");
const keys_1 = require("../keys");
const sequence_1 = require("../sequence");
const writer_1 = require("../writer");
/**
 * Provides the function that populates the response object with
 * the results of the operation.
 *
 * @returns The handler function that will populate the
 * response with operation results.
 */
let SendProvider = class SendProvider {
    static value() {
        return writer_1.writeResultToResponse;
    }
};
SendProvider = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON })
], SendProvider);
exports.SendProvider = SendProvider;
let SendResponseMiddlewareProvider = class SendResponseMiddlewareProvider {
    value() {
        return async (ctx, next) => {
            const send = await ctx.get(keys_1.RestBindings.SequenceActions.SEND);
            const reject = await ctx.get(keys_1.RestBindings.SequenceActions.REJECT);
            try {
                /**
                 * Invoke downstream middleware to produce the result
                 */
                const result = await next();
                /**
                 * Write the result to HTTP response
                 */
                send(ctx.response, result);
            }
            catch (err) {
                /**
                 * Write the error to HTTP response
                 */
                reject(ctx, err);
            }
        };
    }
};
SendResponseMiddlewareProvider = tslib_1.__decorate([
    (0, core_1.injectable)((0, express_1.asMiddleware)({
        group: sequence_1.RestMiddlewareGroups.SEND_RESPONSE,
        downstreamGroups: [
            sequence_1.RestMiddlewareGroups.CORS,
            sequence_1.RestMiddlewareGroups.INVOKE_METHOD,
        ],
        chain: keys_1.RestTags.REST_MIDDLEWARE_CHAIN,
    }), { scope: core_1.BindingScope.SINGLETON })
], SendResponseMiddlewareProvider);
exports.SendResponseMiddlewareProvider = SendResponseMiddlewareProvider;
//# sourceMappingURL=send.provider.js.map