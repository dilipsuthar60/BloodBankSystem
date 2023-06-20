"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibility = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const debug = require('debug')('loopback:openapi3:metadata:controller-spec:visibility');
/**
 * Marks an api path with the specfied visibility.  When applied to a class,
 * this decorator marks all paths with the specified visibility.
 *
 * You can optionally mark all controllers in a class with
 * `@visibility('undocumented')`, but use `@visibility('documented')`
 * on a specific method to ensure it is not marked as `undocumented`.
 *
 * @param visibilityTyoe - The visbility of the api path on the OAS3 spec.
 *
 * @example
 * ```ts
 * @oas.visibility('undocumented')
 * class MyController {
 *   @get('/greet')
 *   async function greet() {
 *     return 'Hello, World!'
 *   }
 *
 *   @get('/greet-v2')
 *   @oas.deprecated('documented')
 *   async function greetV2() {
 *     return 'Hello, World!'
 *   }
 * }
 *
 * class MyOtherController {
 *   @get('/echo')
 *   async function echo() {
 *     return 'Echo!'
 *   }
 * }
 * ```
 */
function visibility(visibilityType) {
    return function visibilityDecoratorForClassOrMethod(
    // Class or a prototype
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target, method, 
    // Use `any` to for `TypedPropertyDescriptor`
    // See https://github.com/loopbackio/loopback-next/pull/2704
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDescriptor) {
        debug(target, method, methodDescriptor);
        if (method && methodDescriptor) {
            // Method
            return core_1.MethodDecoratorFactory.createDecorator(keys_1.OAI3Keys.VISIBILITY_METHOD_KEY, visibilityType, {
                decoratorName: '@oas.visibility',
            })(target, method, methodDescriptor);
        }
        else if (typeof target === 'function' && !method && !methodDescriptor) {
            // Class
            return core_1.ClassDecoratorFactory.createDecorator(keys_1.OAI3Keys.VISIBILITY_CLASS_KEY, visibilityType, { decoratorName: '@oas.visibility' })(target);
        }
        else {
            throw new Error('@oas.visibility cannot be used on a property: ' +
                core_1.DecoratorFactory.getTargetName(target, method, methodDescriptor));
        }
    };
}
exports.visibility = visibility;
//# sourceMappingURL=visibility.decorator.js.map