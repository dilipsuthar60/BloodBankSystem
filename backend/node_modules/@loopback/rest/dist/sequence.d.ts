import { Context, ValueOrPromise } from '@loopback/core';
import { InvokeMiddleware, InvokeMiddlewareOptions } from '@loopback/express';
import { RequestContext } from './request-context';
import { FindRoute, InvokeMethod, ParseParams, Reject, Send } from './types';
/**
 * A sequence function is a function implementing a custom
 * sequence of actions to handle an incoming request.
 */
export type SequenceFunction = (context: RequestContext, sequence: DefaultSequence) => ValueOrPromise<void>;
/**
 * A sequence handler is a class implementing sequence of actions
 * required to handle an incoming request.
 */
export interface SequenceHandler {
    /**
     * Handle the request by running the configured sequence of actions.
     *
     * @param context - The request context: HTTP request and response objects,
     * per-request IoC container and more.
     */
    handle(context: RequestContext): Promise<void>;
}
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
export declare class DefaultSequence implements SequenceHandler {
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    send: Send;
    reject: Reject;
    /**
     * Optional invoker for registered middleware in a chain.
     * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
     */
    protected invokeMiddleware: InvokeMiddleware;
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
    constructor(findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject);
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
    handle(context: RequestContext): Promise<void>;
}
/**
 * Built-in middleware groups for the REST sequence
 */
export declare namespace RestMiddlewareGroups {
    /**
     * Invoke downstream middleware to get the result or catch errors so that it
     * can produce the http response
     */
    const SEND_RESPONSE = "sendResponse";
    /**
     * Enforce CORS
     */
    const CORS = "cors";
    /**
     * Server OpenAPI specs
     */
    const API_SPEC = "apiSpec";
    /**
     * Default middleware group
     */
    const MIDDLEWARE = "middleware";
    const DEFAULT = "middleware";
    /**
     * Find the route that can serve the request
     */
    const FIND_ROUTE = "findRoute";
    /**
     * Perform authentication
     */
    const AUTHENTICATION = "authentication";
    /**
     * Parse the http request to extract parameter values for the operation
     */
    const PARSE_PARAMS = "parseParams";
    /**
     * Invoke the target controller method or handler function
     */
    const INVOKE_METHOD = "invokeMethod";
}
/**
 * A sequence implementation using middleware chains
 */
export declare class MiddlewareSequence implements SequenceHandler {
    readonly invokeMiddleware: InvokeMiddleware;
    readonly options: InvokeMiddlewareOptions;
    private middlewareView;
    static defaultOptions: InvokeMiddlewareOptions;
    /**
     * Constructor: Injects `InvokeMiddleware` and `InvokeMiddlewareOptions`
     *
     * @param invokeMiddleware - invoker for registered middleware in a chain.
     * To be injected via RestBindings.INVOKE_MIDDLEWARE_SERVICE.
     */
    constructor(context: Context, invokeMiddleware: InvokeMiddleware, options?: InvokeMiddlewareOptions);
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
    handle(context: RequestContext): Promise<void>;
}
