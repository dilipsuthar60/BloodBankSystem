"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrors = exports.writeErrorToResponse = void 0;
const tslib_1 = require("tslib");
/**
 * The REST API package for loopback-next.
 *
 * @remarks
 * A REST server for LoopBack 4 application instances, complete with:
 *
 * - new custom routing engine (special thanks to @bajtos)!
 * - tools for defining your application routes
 * - OpenAPI 3.0 spec (openapi.json/openapi.yaml) generation using
 *   @loopback/openapi-v3
 * - a default sequence implementation to manage the request and response
 *   lifecycle
 *
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("@loopback/openapi-v3"), exports);
var strong_error_handler_1 = require("strong-error-handler");
Object.defineProperty(exports, "writeErrorToResponse", { enumerable: true, get: function () { return strong_error_handler_1.writeErrorToResponse; } });
tslib_1.__exportStar(require("./body-parsers"), exports);
tslib_1.__exportStar(require("./http-handler"), exports);
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./parse-json"), exports);
tslib_1.__exportStar(require("./parser"), exports);
tslib_1.__exportStar(require("./providers"), exports);
tslib_1.__exportStar(require("./request-context"), exports);
tslib_1.__exportStar(require("./rest-http-error"), exports);
tslib_1.__exportStar(require("./rest.application"), exports);
tslib_1.__exportStar(require("./rest.component"), exports);
tslib_1.__exportStar(require("./rest.server"), exports);
tslib_1.__exportStar(require("./router"), exports);
tslib_1.__exportStar(require("./sequence"), exports);
tslib_1.__exportStar(require("./spec-enhancers/info.spec-enhancer"), exports);
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./validation/request-body.validator"), exports);
tslib_1.__exportStar(require("./writer"), exports);
// export all errors from external http-errors package
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
exports.HttpErrors = http_errors_1.default;
//# sourceMappingURL=index.js.map