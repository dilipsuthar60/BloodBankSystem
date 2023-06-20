"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationVisibility = exports.createEmptyApiSpec = exports.DEFAULT_OPENAPI_SPEC_INFO = void 0;
const tslib_1 = require("tslib");
// Export also all spec interfaces
tslib_1.__exportStar(require("openapi3-ts"), exports);
exports.DEFAULT_OPENAPI_SPEC_INFO = {
    title: 'LoopBack Application',
    version: '1.0.0',
};
/**
 * Create an empty OpenApiSpec object that's still a valid openapi document.
 *
 * @deprecated Use `OpenApiBuilder` from `openapi3-ts` instead.
 */
function createEmptyApiSpec() {
    return {
        openapi: '3.0.0',
        info: {
            ...exports.DEFAULT_OPENAPI_SPEC_INFO,
        },
        paths: {},
        servers: [{ url: '/' }],
    };
}
exports.createEmptyApiSpec = createEmptyApiSpec;
var OperationVisibility;
(function (OperationVisibility) {
    OperationVisibility["DOCUMENTED"] = "documented";
    OperationVisibility["UNDOCUMENTED"] = "undocumented";
})(OperationVisibility = exports.OperationVisibility || (exports.OperationVisibility = {}));
//# sourceMappingURL=types.js.map