"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const express_1 = require("@loopback/express");
const openapi_v3_1 = require("@loopback/openapi-v3");
const body_parsers_1 = require("./body-parsers");
const body_parser_raw_1 = require("./body-parsers/body-parser.raw");
const keys_1 = require("./keys");
const providers_1 = require("./providers");
const rest_server_1 = require("./rest.server");
const consolidate_spec_enhancer_1 = require("./spec-enhancers/consolidate.spec-enhancer");
const info_spec_enhancer_1 = require("./spec-enhancers/info.spec-enhancer");
const ajv_factory_provider_1 = require("./validation/ajv-factory.provider");
let RestComponent = class RestComponent {
    constructor(app, config) {
        var _a;
        this.providers = {
            [keys_1.RestBindings.AJV_FACTORY.key]: ajv_factory_provider_1.AjvFactoryProvider,
        };
        /**
         * Add built-in body parsers
         */
        this.bindings = [
            ...createActionBindings(),
            // FIXME(rfeng): We now register request body parsers in TRANSIENT scope
            // so that they can be bound at application or server level
            core_1.Binding.bind(keys_1.RestBindings.REQUEST_BODY_PARSER).toClass(body_parsers_1.RequestBodyParser),
            (0, rest_server_1.createBodyParserBinding)(body_parsers_1.JsonBodyParser, keys_1.RestBindings.REQUEST_BODY_PARSER_JSON),
            (0, rest_server_1.createBodyParserBinding)(body_parsers_1.TextBodyParser, keys_1.RestBindings.REQUEST_BODY_PARSER_TEXT),
            (0, rest_server_1.createBodyParserBinding)(body_parsers_1.UrlEncodedBodyParser, keys_1.RestBindings.REQUEST_BODY_PARSER_URLENCODED),
            (0, rest_server_1.createBodyParserBinding)(body_parser_raw_1.RawBodyParser, keys_1.RestBindings.REQUEST_BODY_PARSER_RAW),
            (0, rest_server_1.createBodyParserBinding)(body_parsers_1.StreamBodyParser, keys_1.RestBindings.REQUEST_BODY_PARSER_STREAM),
            (0, core_1.createBindingFromClass)(info_spec_enhancer_1.InfoSpecEnhancer),
            (0, core_1.createBindingFromClass)(consolidate_spec_enhancer_1.ConsolidationEnhancer),
            ...getRestMiddlewareBindings(),
        ];
        this.servers = {
            RestServer: rest_server_1.RestServer,
        };
        // Register the `InvokeMiddleware` with default to `ACTION_MIDDLEWARE_CHAIN`
        // to keep backward compatibility with action based sequence
        const invokeMiddlewareActionBinding = (0, core_1.createBindingFromClass)(express_1.InvokeMiddlewareProvider, {
            key: keys_1.RestBindings.SequenceActions.INVOKE_MIDDLEWARE,
        }).tag({ [core_1.CoreTags.EXTENSION_POINT]: keys_1.RestTags.ACTION_MIDDLEWARE_CHAIN });
        app.add(invokeMiddlewareActionBinding);
        // Register the `InvokeMiddleware` with default to `DEFAULT_MIDDLEWARE_CHAIN`
        // for the middleware based sequence
        const invokeMiddlewareServiceBinding = (0, core_1.createBindingFromClass)(express_1.InvokeMiddlewareProvider, {
            key: keys_1.RestBindings.INVOKE_MIDDLEWARE_SERVICE,
        }).tag({ [core_1.CoreTags.EXTENSION_POINT]: keys_1.RestTags.REST_MIDDLEWARE_CHAIN });
        app.add(invokeMiddlewareServiceBinding);
        const apiSpec = (0, openapi_v3_1.createEmptyApiSpec)();
        // Merge the OpenAPI `servers` spec from the config into the empty one
        if ((_a = config === null || config === void 0 ? void 0 : config.openApiSpec) === null || _a === void 0 ? void 0 : _a.servers) {
            Object.assign(apiSpec, { servers: config.openApiSpec.servers });
        }
        app.bind(keys_1.RestBindings.API_SPEC).to(apiSpec);
    }
};
RestComponent = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.RestBindings.CONFIG)),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, Object])
], RestComponent);
exports.RestComponent = RestComponent;
function getRestMiddlewareBindings() {
    return [
        providers_1.SendResponseMiddlewareProvider,
        providers_1.FindRouteMiddlewareProvider,
        providers_1.ParseParamsMiddlewareProvider,
        providers_1.InvokeMethodMiddlewareProvider,
    ].map(cls => (0, core_1.createBindingFromClass)(cls));
}
function createActionBindings() {
    const bindings = [];
    const providers = {
        [keys_1.RestBindings.SequenceActions.LOG_ERROR.key]: providers_1.LogErrorProvider,
        [keys_1.RestBindings.SequenceActions.FIND_ROUTE.key]: providers_1.FindRouteProvider,
        [keys_1.RestBindings.SequenceActions.INVOKE_METHOD.key]: providers_1.InvokeMethodProvider,
        [keys_1.RestBindings.SequenceActions.REJECT.key]: providers_1.RejectProvider,
        [keys_1.RestBindings.SequenceActions.PARSE_PARAMS.key]: providers_1.ParseParamsProvider,
        [keys_1.RestBindings.SequenceActions.SEND.key]: providers_1.SendProvider,
    };
    for (const k in providers) {
        bindings.push((0, core_1.createBindingFromClass)(providers[k], { key: k }));
    }
    return bindings;
}
//# sourceMappingURL=rest.component.js.map