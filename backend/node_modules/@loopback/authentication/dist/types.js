"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticationMetadataForStrategy = exports.asAuthStrategy = exports.registerAuthenticationStrategy = exports.USER_PROFILE_NOT_FOUND = exports.AUTHENTICATION_STRATEGY_NOT_FOUND = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
exports.AUTHENTICATION_STRATEGY_NOT_FOUND = 'AUTHENTICATION_STRATEGY_NOT_FOUND';
exports.USER_PROFILE_NOT_FOUND = 'USER_PROFILE_NOT_FOUND';
/**
 * Registers an authentication strategy as an extension of the
 * AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME extension
 * point.
 *
 * @param context - Context object
 * @param strategyClass - Class for the authentication strategy
 */
function registerAuthenticationStrategy(context, strategyClass) {
    return (0, core_1.addExtension)(context, keys_1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME, strategyClass, {
        namespace: keys_1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    });
}
exports.registerAuthenticationStrategy = registerAuthenticationStrategy;
/**
 * A binding template for auth strategy contributor extensions
 */
const asAuthStrategy = binding => {
    (0, core_1.extensionFor)(keys_1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME)(binding);
    binding.tag({
        namespace: keys_1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    });
};
exports.asAuthStrategy = asAuthStrategy;
/**
 * Get the authentication metadata object for the specified strategy.
 *
 * @param metadata - Array of authentication metadata objects
 * @param strategyName - Name of the authentication strategy
 */
function getAuthenticationMetadataForStrategy(metadata, strategyName) {
    return metadata.find(data => data.strategy === strategyName);
}
exports.getAuthenticationMetadataForStrategy = getAuthenticationMetadataForStrategy;
//# sourceMappingURL=types.js.map