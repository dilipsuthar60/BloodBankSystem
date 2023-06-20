"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationStrategyProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const types_1 = require("../types");
/**
 * An authentication strategy provider responsible for
 * resolving an authentication strategy by name.
 *
 * It declares an extension point to which all authentication strategy
 * implementations must register themselves as extensions.
 *
 * @example `context.bind('authentication.strategy').toProvider(AuthenticationStrategyProvider)`
 */
let AuthenticationStrategyProvider = class AuthenticationStrategyProvider {
    constructor(authenticationStrategies, metadata) {
        this.authenticationStrategies = authenticationStrategies;
        this.metadata = metadata;
    }
    async value() {
        var _a;
        if (!((_a = this.metadata) === null || _a === void 0 ? void 0 : _a.length)) {
            return undefined;
        }
        return this.findAuthenticationStrategies(this.metadata);
    }
    async findAuthenticationStrategies(metadata) {
        const strategies = [];
        const existingStrategies = await this.authenticationStrategies();
        const findStrategy = (name) => {
            const strategy = existingStrategies.find(a => a.name === name);
            if (!strategy) {
                const error = new Error(`The strategy '${name}' is not available.`);
                Object.assign(error, {
                    code: types_1.AUTHENTICATION_STRATEGY_NOT_FOUND,
                });
                throw error;
            }
            return strategy;
        };
        for (const data of metadata) {
            const strategy = findStrategy(data.strategy);
            strategies.push(strategy);
        }
        return strategies;
    }
};
AuthenticationStrategyProvider = tslib_1.__decorate([
    (0, core_1.extensionPoint)(keys_1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME, { scope: core_1.BindingScope.TRANSIENT }) //this needs to be transient, e.g. for request level context.
    ,
    tslib_1.__param(0, (0, core_1.extensions)()),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.AuthenticationBindings.METADATA)),
    tslib_1.__metadata("design:paramtypes", [Function, Array])
], AuthenticationStrategyProvider);
exports.AuthenticationStrategyProvider = AuthenticationStrategyProvider;
//# sourceMappingURL=auth-strategy.provider.js.map