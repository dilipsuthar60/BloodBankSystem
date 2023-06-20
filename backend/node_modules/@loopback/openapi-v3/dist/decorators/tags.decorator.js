"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
/**
 * Add tags for an endpoint. When applied to a class, this decorator
 * adds the tags to all endpoints.
 *
 * @param tagNames - A list of tags for API documentation control. Tags can be
 *        used for logical grouping of operations by resources or any other
 *        qualifier.
 *
 * @example
 * ```ts
 * @oas.tags('greeting', 'public')
 * class MyController {
 *   @get('/greet')
 *   greet() {
 *     return 'Hello world!';
 *   }

 *   @get('/echo')
 *   echo() {
 *     return 'Hello world!';
 *   }
 * }
 * ```
 *
 * or
 *
 * ```ts
 * class MyController {
 *   @oas.tags('greeting', 'public')
 *   @get('/greet')
 *   greet() {
 *     return 'Hello world!';
 *   }

 *   @get('/echo')
 *   echo() {
 *     return 'Hello world!';
 *   }
 * }
 * ```
 */
function tags(...tagNames) {
    return function tagsDecoratorForClassOrMethod(
    // Class or a prototype
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target, method, 
    // Use `any` to for `TypedPropertyDescriptor`
    // See https://github.com/loopbackio/loopback-next/pull/2704
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDescriptor) {
        if (method && methodDescriptor) {
            // Method
            return core_1.MethodDecoratorFactory.createDecorator(keys_1.OAI3Keys.TAGS_METHOD_KEY, { tags: tagNames }, { decoratorName: '@oas.tags' })(target, method, methodDescriptor);
        }
        else if (typeof target === 'function' && !method && !methodDescriptor) {
            // Class
            return core_1.ClassDecoratorFactory.createDecorator(keys_1.OAI3Keys.TAGS_CLASS_KEY, { tags: tagNames }, { decoratorName: '@oas.tags' })(target);
        }
        else {
            throw new Error('@oas.tags cannot be used on a property: ' +
                core_1.DecoratorFactory.getTargetName(target, method, methodDescriptor));
        }
    };
}
exports.tags = tags;
//# sourceMappingURL=tags.decorator.js.map