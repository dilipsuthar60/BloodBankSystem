import { Binding, BindingTemplate, Constructor, Context, ContextView, InvocationResult, Provider, ValueOrPromise } from '@loopback/core';
import { ExpressMiddlewareFactory, ExpressRequestHandler, InvokeMiddlewareOptions, Middleware, MiddlewareBindingOptions, MiddlewareContext } from './types';
/**
 * An adapter function to create a LoopBack middleware that invokes the list
 * of Express middleware handler functions in the order of their positions
 * @example
 * ```ts
 * toMiddleware(fn);
 * toMiddleware(fn1, fn2, fn3);
 * ```
 * @param firstHandler - An Express middleware handler
 * @param additionalHandlers A list of Express middleware handler functions
 * @returns A LoopBack middleware function that wraps the list of Express
 * middleware
 */
export declare function toMiddleware(firstHandler: ExpressRequestHandler, ...additionalHandlers: ExpressRequestHandler[]): Middleware;
/**
 * An adapter function to create a LoopBack middleware from Express middleware
 * factory function and configuration object.
 *
 * @param middlewareFactory - Express middleware factory function
 * @param middlewareConfig - Express middleware config
 *
 * @returns A LoopBack middleware function that wraps the Express middleware
 */
export declare function createMiddleware<CFG>(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG): Middleware;
/**
 * Bind a Express middleware to the given context
 *
 * @param ctx - Context object
 * @param middlewareFactory - Middleware module name or factory function
 * @param middlewareConfig - Middleware config
 * @param options - Options for registration
 *
 * @typeParam CFG - Configuration type
 */
export declare function registerExpressMiddleware<CFG>(ctx: Context, middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG, options?: MiddlewareBindingOptions): Binding<Middleware>;
/**
 * Template function for middleware bindings
 * @param options - Options to configure the binding
 */
export declare function asMiddleware(options?: MiddlewareBindingOptions): BindingTemplate;
/**
 * Bind the middleware function or provider class to the context
 * @param ctx - Context object
 * @param middleware - Middleware function or provider class
 * @param options - Middleware binding options
 */
export declare function registerMiddleware(ctx: Context, middleware: Middleware | Constructor<Provider<Middleware>>, options: MiddlewareBindingOptions): Binding<Middleware>;
/**
 * Create a binding for the middleware provider class
 *
 * @param middlewareProviderClass - Middleware provider class
 * @param options - Options to create middleware binding
 *
 */
export declare function createMiddlewareBinding(middlewareProviderClass: Constructor<Provider<Middleware>>, options?: MiddlewareBindingOptions): Binding<Middleware>;
/**
 * Discover and invoke registered middleware in a chain for the given extension
 * point.
 *
 * @param middlewareCtx - Middleware context
 * @param options - Options to invoke the middleware chain
 */
export declare function invokeMiddleware(middlewareCtx: MiddlewareContext, options?: InvokeMiddlewareOptions): ValueOrPromise<InvocationResult>;
/**
 * Watch middleware binding keys for the given context and sort them by
 * group
 * @param ctx - Context object
 * @param options - Middleware options
 */
export declare class MiddlewareView extends ContextView {
    private options;
    private keys;
    constructor(ctx: Context, options?: InvokeMiddlewareOptions);
    refresh(): void;
    /**
     * A list of binding keys sorted by group for registered middleware
     */
    get middlewareBindingKeys(): string[];
    private buildMiddlewareKeys;
}
/**
 * Invoke a list of Express middleware handler functions
 *
 * @example
 * ```ts
 * import cors from 'cors';
 * import helmet from 'helmet';
 * import morgan from 'morgan';
 * import {MiddlewareContext, invokeExpressMiddleware} from '@loopback/express';
 *
 * // ... Either an instance of `MiddlewareContext` is passed in or a new one
 * // can be instantiated from Express request and response objects
 *
 * const middlewareCtx = new MiddlewareContext(request, response);
 * const finished = await invokeExpressMiddleware(
 *   middlewareCtx,
 *   cors(),
 *   helmet(),
 *   morgan('combined'));
 *
 * if (finished) {
 *   // Http response is sent by one of the middleware
 * } else {
 *   // Http response is yet to be produced
 * }
 * ```
 * @param middlewareCtx - Middleware context
 * @param handlers - A list of Express middleware handler functions
 */
export declare function invokeExpressMiddleware(middlewareCtx: MiddlewareContext, ...handlers: ExpressRequestHandler[]): ValueOrPromise<boolean>;
/**
 * An adapter function to create an Express middleware handler to discover and
 * invoke registered LoopBack-style middleware in the context.
 * @param ctx - Context object to discover registered middleware
 */
export declare function toExpressMiddleware(ctx: Context): ExpressRequestHandler;
