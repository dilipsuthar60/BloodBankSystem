"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMetadataProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const decorators_1 = require("../decorators");
const keys_1 = require("../keys");
/**
 * Provides authentication metadata of a controller method
 * @example `context.bind('authentication.operationMetadata').toProvider(AuthMetadataProvider)`
 */
let AuthMetadataProvider = class AuthMetadataProvider {
    constructor(controllerClass, methodName, options = {}) {
        this.controllerClass = controllerClass;
        this.methodName = methodName;
        this.options = options;
    }
    /**
     * @returns AuthenticationMetadata
     */
    value() {
        var _a;
        if (!this.controllerClass || !this.methodName)
            return;
        const metadata = (0, decorators_1.getAuthenticateMetadata)(this.controllerClass, this.methodName);
        // Skip authentication if `skip` is `true`
        if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata[0]) === null || _a === void 0 ? void 0 : _a.skip)
            return undefined;
        if (metadata)
            return metadata;
        // Fall back to default metadata
        return this.options.defaultMetadata;
    }
};
AuthMetadataProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.CONTROLLER_CLASS, { optional: true })),
    tslib_1.__param(1, (0, core_1.inject)(core_1.CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })),
    tslib_1.__param(2, (0, core_1.config)({ fromBinding: keys_1.AuthenticationBindings.COMPONENT })),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object])
], AuthMetadataProvider);
exports.AuthMetadataProvider = AuthMetadataProvider;
//# sourceMappingURL=auth-metadata.provider.js.map