"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var MiddlewareSequence_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareSequence = exports.RestMiddlewareGroups = exports.DefaultSequence = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const express_1 = require("@loopback/express");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("./keys");
const debug = (0, debug_1.default)('loopback:rest:sequence');
const SequenceActions = keys_1.RestBindings.SequenceActions;
/**
 * The default implementation of SequenceHandler.
 *
 * @remarks
 * This class implements default Sequence for the LoopBack framework.
 * Default sequence is used if user hasn't defined their own Sequence
 * for their application.
 *
 * Sequence constructor() and run() methods are invoked from [[http-handler]]
 * when the API request comes in. User defines APIs in their Application
 * Controller class.
 *
 * @example
 * User can bind their own Sequence to app as shown below
 * ```ts
 * app.bind(CoreBindings.SEQUENCE).toClass(MySequence);
 * ```
 */
let DefaultSequence = class DefaultSequence {
    /**
     * Constructor: Injects findRoute, invokeMethod & logError
     * methods as promises.
     *
     * @param findRoute - Finds the appropriate controller method,
     *  spec and args for invocation (injected via SequenceActions.FIND_ROUTE).
     * @param parseParams - The parameter parsing function (injected
     * via SequenceActions.PARSE_PARAMS).
     * @param invoke - Invokes the method specified by the route
     * (injected via SequenceActions.INVOKE_METHOD).
     * @param send - The action to merge the invoke result with the response
     * (injected via SequenceActions.SEND)
     * @param reject - The action to take if the invoke returns a rejected
     * promise result (injected via SequenceActions.REJECT).
     */
    constructor(findRoute, parseParams, invoke, send, reject) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        /**
         * Optional invoker for registered middleware in a chain.
         * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
         */
        this.invokeMiddleware = () => false;
    }
    /**
     * Runs the default sequence. Given a handler context (request and response),
     * running the sequence will produce a response or an error.
     *
     * Default sequence executes these steps
     *  - Executes middleware for CORS, OpenAPI spec endpoints
     *  - Finds the appropriate controller method, swagger spec
     *    and args for invocation
     *  - Parses HTTP request to get API argument list
     *  - Invokes the API which is defined in the Application Controller
     *  - Writes the result from API into the HTTP response
     *  - Error is caught and logged using 'logError' if any of the above steps
     *    in the sequence fails with an error.
     *
     * @param context - The request context: HTTP request and response objects,
     * per-request IoC container and more.
     */
    async handle(context) {
        try {
            const { request, response } = context;
            // Invoke registered Express middleware
            const finished = await this.invokeMiddleware(context);
            if (finished) {
                // The response been produced by the middleware chain
                return;
            }
            const route = this.findRoute(request);
            const args = await this.parseParams(request, route);
            const result = await this.invoke(route, args);
            debug('%s result -', route.describe(), result);
            this.send(response, result);
        }
        catch (error) {
            this.reject(context, error);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.inject)(SequenceActions.INVOKE_MIDDLEWARE, { optional: true }),
    tslib_1.__metadata("design:type", Function)
], DefaultSequence.prototype, "invokeMiddleware", void 0);
DefaultSequence = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(SequenceActions.FIND_ROUTE)),
    tslib_1.__param(1, (0, core_1.inject)(SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(2, (0, core_1.inject)(SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(3, (0, core_1.inject)(SequenceActions.SEND)),
    tslib_1.__param(4, (0, core_1.inject)(SequenceActions.REJECT)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Function])
], DefaultSequence);
exports.DefaultSequence = DefaultSequence;
/**
 * Built-in middleware groups for the REST sequence
 */
var RestMiddlewareGroups;
(function (RestMiddlewareGroups) {
    /**
     * Invoke downstream middleware to get the result or catch errors so that it
     * can produce the http response
     */
    RestMiddlewareGroups.SEND_RESPONSE = 'sendResponse';
    /**
     * Enforce CORS
     */
    RestMiddlewareGroups.CORS = express_1.MiddlewareGroups.CORS;
    /**
     * Server OpenAPI specs
     */
    RestMiddlewareGroups.API_SPEC = express_1.MiddlewareGroups.API_SPEC;
    /**
     * Default middleware group
     */
    RestMiddlewareGroups.MIDDLEWARE = express_1.MiddlewareGroups.MIDDLEWARE;
    RestMiddlewareGroups.DEFAULT = RestMiddlewareGroups.MIDDLEWARE;
    /**
     * Find the route that can serve the request
     */
    RestMiddlewareGroups.FIND_ROUTE = 'findRoute';
    /**
     * Perform authentication
     */
    RestMiddlewareGroups.AUTHENTICATION = 'authentication';
    /**
     * Parse the http request to extract parameter values for the operation
     */
    RestMiddlewareGroups.PARSE_PARAMS = 'parseParams';
    /**
     * Invoke the target controller method or handler function
     */
    RestMiddlewareGroups.INVOKE_METHOD = 'invokeMethod';
})(RestMiddlewareGroups = exports.RestMiddlewareGroups || (exports.RestMiddlewareGroups = {}));
/**
 * A sequence implementation using middleware chains
 */
let MiddlewareSequence = MiddlewareSequence_1 = class MiddlewareSequence {
    /**
     * Constructor: Injects `InvokeMiddleware` and `InvokeMiddlewareOptions`
     *
     * @param invokeMiddleware - invoker for registered middleware in a chain.
     * To be injected via RestBindings.INVOKE_MIDDLEWARE_SERVICE.
     */
    constructor(context, invokeMiddleware, options = MiddlewareSequence_1.defaultOptions) {
        this.invokeMiddleware = invokeMiddleware;
        this.options = options;
        this.middlewareView = new express_1.MiddlewareView(context, options);
        debug('Discovered middleware', this.middlewareView.middlewareBindingKeys);
    }
    /**
     * Runs the default sequence. Given a handler context (request and response),
     * running the sequence will produce a response or an error.
     *
     * Default sequence executes these groups of middleware:
     *
     *  - `cors`: Enforces `CORS`
     *  - `openApiSpec`: Serves OpenAPI specs
     *  - `findRoute`: Finds the appropriate controller method, swagger spec and
     *    args for invocation
     *  - `parseParams`: Parses HTTP request to get API argument list
     *  - `invokeMethod`: Invokes the API which is defined in the Application
     *    controller method
     *
     * In front of the groups above, we have a special middleware called
     * `sendResponse`, which first invokes downstream middleware to get a result
     * and handles the result or error respectively.
     *
     *  - Writes the result from API into the HTTP response (if the HTTP response
     *    has not been produced yet by the middleware chain.
     *  - Catches error logs it using 'logError' if any of the above steps
     *    in the sequence fails with an error.
     *
     * @param context - The request context: HTTP request and response objects,
     * per-request IoC container and more.
     */
    async handle(context) {
        debug('Invoking middleware chain %s with groups %s', this.options.chain, this.options.orderedGroups);
        const options = {
            middlewareList: this.middlewareView.middlewareBindingKeys,
            validate: MiddlewareSequence_1.defaultOptions.validate,
            ...this.options,
        };
        await this.invokeMiddleware(context, options);
    }
};
MiddlewareSequence.defaultOptions = {
    chain: keys_1.RestTags.REST_MIDDLEWARE_CHAIN,
    orderedGroups: [
        // Please note that middleware is cascading. The `sendResponse` is
        // added first to invoke downstream middleware to get the result or
        // catch errors so that it can produce the http response.
        RestMiddlewareGroups.SEND_RESPONSE,
        RestMiddlewareGroups.CORS,
        RestMiddlewareGroups.API_SPEC,
        RestMiddlewareGroups.MIDDLEWARE,
        RestMiddlewareGroups.FIND_ROUTE,
        // authentication depends on the route
        RestMiddlewareGroups.AUTHENTICATION,
        RestMiddlewareGroups.PARSE_PARAMS,
        RestMiddlewareGroups.INVOKE_METHOD,
    ],
    /**
     * Reports an error if there are middleware groups are unreachable as they
     * are ordered after the `invokeMethod` group.
     */
    validate: groups => {
        const index = groups.indexOf(RestMiddlewareGroups.INVOKE_METHOD);
        if (index !== -1) {
            const unreachableGroups = groups.slice(index + 1);
            if (unreachableGroups.length > 0) {
                throw new Error(`Middleware groups "${unreachableGroups.join(',')}" are not invoked as they are ordered after "${RestMiddlewareGroups.INVOKE_METHOD}"`);
            }
        }
    },
};
MiddlewareSequence = MiddlewareSequence_1 = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, core_1.inject.context()),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.RestBindings.INVOKE_MIDDLEWARE_SERVICE)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [core_1.Context, Function, Object])
], MiddlewareSequence);
exports.MiddlewareSequence = MiddlewareSequence;
//# sourceMappingURL=sequence.js.map