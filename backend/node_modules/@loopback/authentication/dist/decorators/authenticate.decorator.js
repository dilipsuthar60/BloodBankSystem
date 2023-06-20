"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticateMetadata = exports.authenticate = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
class AuthenticateClassDecoratorFactory extends core_1.ClassDecoratorFactory {
}
/**
 * Mark a controller method as requiring authenticated user.
 *
 * @param strategies - The names of the authentication strategies to use
 * or authentication metadata objects.
 */
function authenticate(...strategies) {
    return function authenticateDecoratorForClassOrMethod(
    // Class or a prototype
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target, method, 
    // Use `any` to for `TypedPropertyDescriptor`
    // See https://github.com/loopbackio/loopback-next/pull/2704
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDescriptor) {
        const specs = [];
        for (const strategy of strategies) {
            if (typeof strategy === 'object') {
                specs.push(strategy);
            }
            else {
                specs.push({ strategy: strategy });
            }
        }
        if (method && methodDescriptor) {
            // Method
            return core_1.MethodDecoratorFactory.createDecorator(keys_1.AUTHENTICATION_METADATA_KEY, specs, { decoratorName: '@authenticate' })(target, method, methodDescriptor);
        }
        if (typeof target === 'function' && !method && !methodDescriptor) {
            // Class
            return AuthenticateClassDecoratorFactory.createDecorator(keys_1.AUTHENTICATION_METADATA_CLASS_KEY, specs, {
                decoratorName: '@authenticate',
            })(target);
        }
        // Not on a class or method
        throw new Error('@authenticate cannot be used on a property: ' +
            core_1.DecoratorFactory.getTargetName(target, method, methodDescriptor));
    };
}
exports.authenticate = authenticate;
(function (authenticate) {
    /**
     * `@authenticate.skip()` - a sugar decorator to skip authentication
     */
    authenticate.skip = () => authenticate({ strategy: '', skip: true });
})(authenticate = exports.authenticate || (exports.authenticate = {}));
/**
 * Fetch authentication metadata stored by `@authenticate` decorator.
 *
 * @param targetClass - Target controller
 * @param methodName - Target method
 */
function getAuthenticateMetadata(targetClass, methodName) {
    // First check method level
    let metadata = core_1.MetadataInspector.getMethodMetadata(keys_1.AUTHENTICATION_METADATA_METHOD_KEY, targetClass.prototype, methodName);
    if (metadata)
        return metadata;
    // Check if the class level has `@authenticate`
    metadata = core_1.MetadataInspector.getClassMetadata(keys_1.AUTHENTICATION_METADATA_CLASS_KEY, targetClass);
    return metadata;
}
exports.getAuthenticateMetadata = getAuthenticateMetadata;
//# sourceMappingURL=authenticate.decorator.js.map