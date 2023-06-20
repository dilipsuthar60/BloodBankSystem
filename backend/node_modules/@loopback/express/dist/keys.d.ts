import { BindingKey } from '@loopback/core';
import { MiddlewareContext } from './types';
export declare namespace MiddlewareBindings {
    /**
     * Binding key for setting and injecting the http request context
     */
    const CONTEXT: BindingKey<MiddlewareContext>;
}
/**
 * Default namespaces for middleware
 */
export declare const MIDDLEWARE_NAMESPACE = "middleware";
/**
 * Default namespace for Express middleware based global interceptors
 */
export declare const GLOBAL_MIDDLEWARE_INTERCEPTOR_NAMESPACE = "globalInterceptors.middleware";
/**
 * Default namespace for Express middleware based local interceptors
 */
export declare const MIDDLEWARE_INTERCEPTOR_NAMESPACE = "globalInterceptors.middleware";
/**
 * Default order group name for Express middleware based global interceptors
 */
export declare const DEFAULT_MIDDLEWARE_GROUP = "middleware";
