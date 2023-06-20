"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogErrorProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
let LogErrorProvider = class LogErrorProvider {
    static value() {
        const logError = (err, statusCode, req) => {
            var _a;
            if (statusCode < 500) {
                return;
            }
            console.error('Request %s %s failed with status code %s. %s', req.method, req.url, statusCode, (_a = err.stack) !== null && _a !== void 0 ? _a : err);
        };
        return logError;
    }
};
LogErrorProvider = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON })
], LogErrorProvider);
exports.LogErrorProvider = LogErrorProvider;
//# sourceMappingURL=log-error.provider.js.map