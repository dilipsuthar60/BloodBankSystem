"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxyWithInterceptors = exports.InterceptionHandler = exports.ProxySource = void 0;
const context_1 = require("./context");
const interceptor_1 = require("./interceptor");
const resolution_session_1 = require("./resolution-session");
/**
 * Invocation source for injected proxies. It wraps a snapshot of the
 * `ResolutionSession` that tracks the binding/injection stack.
 */
class ProxySource {
    constructor(value) {
        this.value = value;
        this.type = 'proxy';
    }
    toString() {
        return this.value.getBindingPath();
    }
}
exports.ProxySource = ProxySource;
/**
 * A proxy handler that applies interceptors
 *
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
class InterceptionHandler {
    constructor(context = new context_1.Context(), session, source) {
        this.context = context;
        this.session = session;
        this.source = source;
    }
    get(target, propertyName, receiver) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetObj = target;
        if (typeof propertyName !== 'string')
            return targetObj[propertyName];
        const propertyOrMethod = targetObj[propertyName];
        if (typeof propertyOrMethod === 'function') {
            return (...args) => {
                var _a;
                return (0, interceptor_1.invokeMethodWithInterceptors)(this.context, target, propertyName, args, {
                    source: (_a = this.source) !== null && _a !== void 0 ? _a : (this.session && new ProxySource(this.session)),
                });
            };
        }
        else {
            return propertyOrMethod;
        }
    }
}
exports.InterceptionHandler = InterceptionHandler;
/**
 * Create a proxy that applies interceptors for method invocations
 * @param target - Target class or object
 * @param context - Context object
 * @param session - Resolution session
 * @param source - Invocation source
 */
function createProxyWithInterceptors(target, context, session, source) {
    return new Proxy(target, new InterceptionHandler(context, resolution_session_1.ResolutionSession.fork(session), source));
}
exports.createProxyWithInterceptors = createProxyWithInterceptors;
//# sourceMappingURL=interception-proxy.js.map