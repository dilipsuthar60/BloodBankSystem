"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseParamsMiddlewareProvider = exports.ParseParamsProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const express_1 = require("@loopback/express");
const debug_1 = tslib_1.__importDefault(require("debug"));
const body_parsers_1 = require("../body-parsers");
const keys_1 = require("../keys");
const parser_1 = require("../parser");
const sequence_1 = require("../sequence");
const ajv_factory_provider_1 = require("../validation/ajv-factory.provider");
const debug = (0, debug_1.default)('loopback:rest:parse-param');
/**
 * Provides the function for parsing args in requests at runtime.
 *
 * @returns The handler function that will parse request args.
 */
class ParseParamsProvider {
    static value(requestBodyParser, validationOptions = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS, ajvFactory) {
        const parseParams = (request, route) => (0, parser_1.parseOperationArgs)(request, route, requestBodyParser, {
            ajvFactory: ajvFactory,
            ...validationOptions,
        });
        return parseParams;
    }
}
tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.REQUEST_BODY_PARSER)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS.deepProperty('validation'), { optional: true })),
    tslib_1.__param(2, (0, core_1.inject)(keys_1.RestBindings.AJV_FACTORY, { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [body_parsers_1.RequestBodyParser, Object, Function]),
    tslib_1.__metadata("design:returntype", Function)
], ParseParamsProvider, "value", null);
exports.ParseParamsProvider = ParseParamsProvider;
let ParseParamsMiddlewareProvider = class ParseParamsMiddlewareProvider {
    value() {
        return async (ctx, next) => {
            var _a;
            const requestBodyParser = await ctx.get(keys_1.RestBindings.REQUEST_BODY_PARSER);
            const validationOptions = (_a = (await ctx.get(keys_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS.deepProperty('validation'), { optional: true }))) !== null && _a !== void 0 ? _a : ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS;
            const ajvFactory = await ctx.get(keys_1.RestBindings.AJV_FACTORY, {
                optional: true,
            });
            const route = await ctx.get(keys_1.RestBindings.Operation.ROUTE);
            debug('Parsing parameters for %s %s', route.verb, route.path);
            const params = await (0, parser_1.parseOperationArgs)(ctx.request, route, requestBodyParser, {
                ajvFactory: ajvFactory,
                ...validationOptions,
            });
            ctx.bind(keys_1.RestBindings.Operation.PARAMS).to(params);
            debug('Parameters', params);
            return next();
        };
    }
};
ParseParamsMiddlewareProvider = tslib_1.__decorate([
    (0, core_1.injectable)((0, express_1.asMiddleware)({
        group: sequence_1.RestMiddlewareGroups.PARSE_PARAMS,
        upstreamGroups: sequence_1.RestMiddlewareGroups.FIND_ROUTE,
        chain: keys_1.RestTags.REST_MIDDLEWARE_CHAIN,
    }), { scope: core_1.BindingScope.SINGLETON })
], ParseParamsMiddlewareProvider);
exports.ParseParamsMiddlewareProvider = ParseParamsMiddlewareProvider;
//# sourceMappingURL=parse-params.provider.js.map