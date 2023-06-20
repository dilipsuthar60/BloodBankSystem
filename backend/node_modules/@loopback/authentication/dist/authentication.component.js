"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const providers_1 = require("./providers");
let AuthenticationComponent = class AuthenticationComponent {
    constructor() {
        this.providers = {
            [keys_1.AuthenticationBindings.AUTH_ACTION.key]: providers_1.AuthenticateActionProvider,
            [keys_1.AuthenticationBindings.STRATEGY.key]: providers_1.AuthenticationStrategyProvider,
            [keys_1.AuthenticationBindings.METADATA.key]: providers_1.AuthMetadataProvider,
            [keys_1.AuthenticationBindings.AUTHENTICATION_MIDDLEWARE.key]: providers_1.AuthenticationMiddlewareProvider,
        };
    }
};
AuthenticationComponent = tslib_1.__decorate([
    (0, core_1.injectable)({ tags: { [core_1.ContextTags.KEY]: keys_1.AuthenticationBindings.COMPONENT } })
], AuthenticationComponent);
exports.AuthenticationComponent = AuthenticationComponent;
//# sourceMappingURL=authentication.component.js.map