import { Binding } from '@loopback/core';
import { ExpressRequestHandler, InvokeMiddleware, InvokeMiddlewareOptions, MiddlewareContext } from '../types';
/**
 * Extension point for middleware to be run as part of the sequence actions
 */
export declare class InvokeMiddlewareProvider {
    static value(
    /**
     * Inject the binding so that we can access `extensionPoint` tag
     */
    binding: Binding<InvokeMiddleware>, 
    /**
     * Default options for invoking the middleware chain
     */
    defaultOptions?: InvokeMiddlewareOptions): InvokeMiddleware;
    static action(middlewareCtx: MiddlewareContext, optionsOrHandlers?: InvokeMiddlewareOptions | ExpressRequestHandler[]): Promise<any>;
}
