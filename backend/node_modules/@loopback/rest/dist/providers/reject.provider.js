"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const strong_error_handler_1 = require("strong-error-handler");
const keys_1 = require("../keys");
// TODO(bajtos) Make this mapping configurable at RestServer level,
// allow apps and extensions to contribute additional mappings.
const codeToStatusCodeMap = {
    ENTITY_NOT_FOUND: 404,
};
let RejectProvider = class RejectProvider {
    static value(logError, errorWriterOptions) {
        const reject = ({ request, response }, error) => {
            const err = error;
            if (!err.status && !err.statusCode && err.code) {
                const customStatus = codeToStatusCodeMap[err.code];
                if (customStatus) {
                    err.statusCode = customStatus;
                }
            }
            const statusCode = err.statusCode || err.status || 500;
            (0, strong_error_handler_1.writeErrorToResponse)(err, request, response, errorWriterOptions);
            logError(error, statusCode, request);
        };
        return reject;
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.SequenceActions.LOG_ERROR)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.RestBindings.ERROR_WRITER_OPTIONS, { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function, Object]),
    tslib_1.__metadata("design:returntype", Function)
], RejectProvider, "value", null);
RejectProvider = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON })
], RejectProvider);
exports.RejectProvider = RejectProvider;
//# sourceMappingURL=reject.provider.js.map