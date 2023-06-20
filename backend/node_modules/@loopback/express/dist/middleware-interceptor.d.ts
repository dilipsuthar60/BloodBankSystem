/// <reference types="express" />
import { Binding, Constructor, Context, ContextView, GenericInterceptor, Interceptor, InvocationContext, Provider } from '@loopback/core';
import { ExpressMiddlewareFactory, ExpressRequestHandler, MiddlewareCreationOptions, MiddlewareInterceptorBindingOptions, Request, Response } from './types';
/**
 * Execute an Express-style callback-based request handler.
 *
 * @param handler - Express middleware handler function
 * @param request
 * @param response
 * @returns A promise resolved to:
 * - `true` when the request was handled
 * - `false` when the handler called `next()` to proceed to the next
 *    handler (middleware) in the chain.
 */
export declare function executeExpressRequestHandler(handler: ExpressRequestHandler, request: Request, response: Response): Promise<boolean>;
/**
 * Wrap an express middleware handler function as an interceptor
 *
 * @example
 * ```ts
 * toInterceptor(fn);
 * toInterceptor(fn1, fn2, fn3);
 * ```
 * @param firstHandler - An Express middleware handler
 * @param additionalHandlers - A list of Express middleware handler function
 *
 * @typeParam CTX - Context type
 */
export declare function toInterceptor<CTX extends Context = InvocationContext>(firstHandler: ExpressRequestHandler, ...additionalHandlers: ExpressRequestHandler[]): GenericInterceptor<CTX>;
/**
 * Create an interceptor function from express middleware.
 * @param middlewareFactory - Express middleware factory function. A wrapper
 * can be created if the Express middleware module does not conform to the
 * factory pattern and signature.
 * @param middlewareConfig - Configuration for the Express middleware
 *
 * @typeParam CFG - Configuration type
 * @typeParam CTX - Context type
 */
export declare function createInterceptor<CFG, CTX extends Context = InvocationContext>(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG): GenericInterceptor<CTX>;
/**
 * Base class for MiddlewareInterceptor provider classes
 *
 * @example
 *
 * To inject the configuration without automatic reloading:
 *
 * ```ts
 * class SpyInterceptorProvider extends ExpressMiddlewareInterceptorProvider<
 *   SpyConfig
 *   > {
 *     constructor(@config() spyConfig?: SpyConfig) {
 *       super(spy, spyConfig);
 *     }
 * }
 * ```
 *
 * To inject the configuration without automatic reloading:
 * ```ts
 * class SpyInterceptorProvider extends ExpressMiddlewareInterceptorProvider<
 *   SpyConfig
 * > {
 *   constructor(@config.view() configView?: ContextView<SpyConfig>) {
 *     super(spy, configView);
 *   }
 * }
 * ```
 *
 * @typeParam CFG - Configuration type
 */
export declare abstract class ExpressMiddlewareInterceptorProvider<CFG, CTX extends Context = InvocationContext> implements Provider<GenericInterceptor<CTX>> {
    protected middlewareFactory: ExpressMiddlewareFactory<CFG>;
    protected middlewareConfigView?: ContextView<CFG>;
    protected middlewareConfig?: CFG;
    constructor(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG | ContextView<CFG>);
    private binding?;
    /**
     * Cached interceptor instance. It has three states:
     *
     * - undefined: Not initialized
     * - null: To be recreated as the configuration is changed
     * - function: The interceptor function created from the latest configuration
     */
    private interceptor?;
    private setupConfigView;
    value(): GenericInterceptor<CTX>;
}
/**
 * Define a provider class that wraps the middleware as an interceptor
 * @param middlewareFactory - Express middleware factory function
 * @param defaultMiddlewareConfig - Default middleware config
 * @param className - Class name for the generated provider class
 *
 * @typeParam CFG - Configuration type
 * @typeParam CTX - Context type
 */
export declare function defineInterceptorProvider<CFG, CTX extends Context = InvocationContext>(middlewareFactory: ExpressMiddlewareFactory<CFG>, defaultMiddlewareConfig?: CFG, options?: MiddlewareCreationOptions): Constructor<Provider<GenericInterceptor<CTX>>>;
/**
 * Build a name for the middleware
 * @param middlewareFactory - Express middleware factory function
 * @param providedName - Provided name
 * @param suffix - Suffix
 */
export declare function buildName<CFG>(middlewareFactory: ExpressMiddlewareFactory<CFG>, providedName?: string, suffix?: string): string | undefined;
/**
 * Bind a middleware interceptor to the given context
 *
 * @param ctx - Context object
 * @param middlewareFactory - Express middleware factory function
 * @param middlewareConfig - Express middleware config
 * @param options - Options for registration
 *
 * @typeParam CFG - Configuration type
 */
export declare function registerExpressMiddlewareInterceptor<CFG>(ctx: Context, middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG, options?: MiddlewareInterceptorBindingOptions): Binding<GenericInterceptor<InvocationContext>>;
/**
 * Create a binding for the middleware based interceptor
 *
 * @param middlewareProviderClass - Middleware provider class
 * @param options - Options to create middlewareFactory interceptor binding
 *
 */
export declare function createMiddlewareInterceptorBinding(middlewareProviderClass: Constructor<Provider<Interceptor>>, options?: MiddlewareInterceptorBindingOptions): Binding<Interceptor>;
