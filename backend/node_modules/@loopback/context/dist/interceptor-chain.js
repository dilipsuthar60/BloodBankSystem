"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeInterceptors = exports.invokeInterceptors = exports.GenericInterceptorChain = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const value_promise_1 = require("./value-promise");
const debug = (0, debug_1.default)('loopback:context:interceptor-chain');
/**
 * Invocation state of an interceptor chain
 */
class InterceptorChainState {
    /**
     * Create a state for the interceptor chain
     * @param interceptors - Interceptor functions or binding keys
     * @param finalHandler - An optional final handler
     */
    constructor(interceptors, finalHandler = () => undefined) {
        this.interceptors = interceptors;
        this.finalHandler = finalHandler;
        this._index = 0;
    }
    /**
     * Get the index for the current interceptor
     */
    get index() {
        return this._index;
    }
    /**
     * Check if the chain is done - all interceptors are invoked
     */
    done() {
        return this._index === this.interceptors.length;
    }
    /**
     * Get the next interceptor to be invoked
     */
    next() {
        if (this.done()) {
            throw new Error('No more interceptor is in the chain');
        }
        return this.interceptors[this._index++];
    }
}
/**
 * A chain of generic interceptors to be invoked for the given context
 *
 * @typeParam C - `Context` class or a subclass of `Context`
 */
class GenericInterceptorChain {
    // Implementation
    constructor(context, interceptors, comparator) {
        this.context = context;
        if (typeof interceptors === 'function') {
            const interceptorsView = context.createView(interceptors, comparator);
            this.getInterceptors = () => {
                const bindings = interceptorsView.bindings;
                if (comparator) {
                    bindings.sort(comparator);
                }
                return bindings.map(b => b.key);
            };
        }
        else if (Array.isArray(interceptors)) {
            this.getInterceptors = () => interceptors;
        }
    }
    /**
     * Invoke the interceptor chain
     */
    invokeInterceptors(finalHandler) {
        // Create a state for each invocation to provide isolation
        const state = new InterceptorChainState(this.getInterceptors(), finalHandler);
        return this.next(state);
    }
    /**
     * Use the interceptor chain as an interceptor
     */
    asInterceptor() {
        return (ctx, next) => {
            return this.invokeInterceptors(next);
        };
    }
    /**
     * Invoke downstream interceptors or the target method
     */
    next(state) {
        if (state.done()) {
            // No more interceptors
            return state.finalHandler();
        }
        // Invoke the next interceptor in the chain
        return this.invokeNextInterceptor(state);
    }
    /**
     * Invoke downstream interceptors
     */
    invokeNextInterceptor(state) {
        const index = state.index;
        const interceptor = state.next();
        const interceptorFn = this.loadInterceptor(interceptor);
        return (0, value_promise_1.transformValueOrPromise)(interceptorFn, fn => {
            /* istanbul ignore if */
            if (debug.enabled) {
                debug('Invoking interceptor %d (%s) on %s', index, fn.name);
            }
            return fn(this.context, () => this.next(state));
        });
    }
    /**
     * Return the interceptor function or resolve the interceptor function as a binding
     * from the context
     *
     * @param interceptor - Interceptor function or binding key
     */
    loadInterceptor(interceptor) {
        if (typeof interceptor === 'function')
            return interceptor;
        debug('Resolving interceptor binding %s', interceptor);
        return this.context.getValueOrPromise(interceptor);
    }
}
exports.GenericInterceptorChain = GenericInterceptorChain;
/**
 * Invoke a chain of interceptors with the context
 * @param context - Context object
 * @param interceptors - An array of interceptor functions or binding keys
 */
function invokeInterceptors(context, interceptors) {
    const chain = new GenericInterceptorChain(context, interceptors);
    return chain.invokeInterceptors();
}
exports.invokeInterceptors = invokeInterceptors;
/**
 * Compose a list of interceptors as a single interceptor
 * @param interceptors - A list of interceptor functions or binding keys
 */
function composeInterceptors(...interceptors) {
    return (ctx, next) => {
        const interceptor = new GenericInterceptorChain(ctx, interceptors).asInterceptor();
        return interceptor(ctx, next);
    };
}
exports.composeInterceptors = composeInterceptors;
//# sourceMappingURL=interceptor-chain.js.map