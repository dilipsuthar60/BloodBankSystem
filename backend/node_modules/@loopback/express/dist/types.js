"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareGroups = exports.MIDDLEWARE_CONTEXT = exports.DEFAULT_MIDDLEWARE_CHAIN = exports.MiddlewareChain = exports.getMiddlewareContext = exports.MiddlewareContext = exports.Router = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const on_finished_1 = tslib_1.__importDefault(require("on-finished"));
const keys_1 = require("./keys");
var express_1 = require("express");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return express_1.Router; } });
/**
 * A per-request Context for middleware to combine an IoC container with handler
 * context (request, response, etc.).
 */
class MiddlewareContext extends core_1.Context {
    /**
     * Constructor for `MiddlewareContext`
     * @param request - Express request object
     * @param response - Express response object
     * @param parent - Parent context
     * @param name - Name of the middleware context
     */
    constructor(request, response, parent, name) {
        super(parent, name);
        this.request = request;
        this.response = response;
        /**
         * A flag to tell if the response is finished.
         */
        this.responseFinished = false;
        this.scope = core_1.BindingScope.REQUEST;
        // Set the request context as a property of Express request object so that
        // downstream Express native integration can access `RequestContext`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        request[exports.MIDDLEWARE_CONTEXT] = this;
        this.setupBindings();
        (0, on_finished_1.default)(this.response, () => {
            this.responseFinished = true;
            // Close the request context when the http response is finished so that
            // it can be recycled by GC
            this.emit('close');
            this.close();
        });
    }
    setupBindings() {
        this.bind(keys_1.MiddlewareBindings.CONTEXT).to(this).lock();
    }
}
exports.MiddlewareContext = MiddlewareContext;
/**
 * A helper function to retrieve the MiddlewareContext/RequestContext from the
 * request object
 * @param request - Express request object
 */
function getMiddlewareContext(request) {
    if (request == null)
        return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request[exports.MIDDLEWARE_CONTEXT];
}
exports.getMiddlewareContext = getMiddlewareContext;
/**
 * An interceptor chain of middleware. This represents a list of cascading
 * middleware functions to be executed by the order of `group` names.
 */
class MiddlewareChain extends core_1.GenericInterceptorChain {
}
exports.MiddlewareChain = MiddlewareChain;
/**
 * Default extension point name for middleware
 */
exports.DEFAULT_MIDDLEWARE_CHAIN = 'middlewareChain.default';
/**
 * A symbol to store `MiddlewareContext` on the request object.  This symbol
 * can be referenced by name, before it is created.
 */
exports.MIDDLEWARE_CONTEXT = Symbol.for('loopback.middleware.context');
/**
 * Constants for middleware groups
 */
var MiddlewareGroups;
(function (MiddlewareGroups) {
    /**
     * Enforce CORS
     */
    MiddlewareGroups.CORS = 'cors';
    /**
     * Server OpenAPI specs
     */
    MiddlewareGroups.API_SPEC = 'apiSpec';
    /**
     * Default middleware group
     */
    MiddlewareGroups.MIDDLEWARE = 'middleware';
    MiddlewareGroups.DEFAULT = MiddlewareGroups.MIDDLEWARE;
})(MiddlewareGroups = exports.MiddlewareGroups || (exports.MiddlewareGroups = {}));
//# sourceMappingURL=types.js.map