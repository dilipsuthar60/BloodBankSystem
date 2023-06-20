"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyGlobalInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
/**
 * This class will be bound to the application as a global `Interceptor` during
 * `boot`
 */
let MyGlobalInterceptor = class MyGlobalInterceptor {
    /*
    constructor() {}
    */
    /**
     * This method is used by LoopBack context to produce an interceptor function
     * for the binding.
     *
     * @returns An interceptor function
     */
    value() {
        return this.intercept.bind(this);
    }
    /**
     * The logic to intercept an invocation
     * @param invocationCtx - Invocation context
     * @param next - A function to invoke next interceptor or the target method
     */
    async intercept(invocationCtx, next) {
        // eslint-disable-next-line no-useless-catch
        try {
            // Add pre-invocation logic here
            const result = await next();
            // Add post-invocation logic here
            return result;
        }
        catch (err) {
            // Add error handling logic here
            throw err;
        }
    }
};
MyGlobalInterceptor = tslib_1.__decorate([
    (0, core_1.globalInterceptor)('auth', { tags: { name: 'myGlobalInterceptor' } })
], MyGlobalInterceptor);
exports.MyGlobalInterceptor = MyGlobalInterceptor;
//# sourceMappingURL=interceptor.artifact.js.map
//# sourceMappingURL=/Users/dianalau/code/loopback/loopback-next/packages/boot/dist/__tests__/fixtures/interceptor.artifact.js.map