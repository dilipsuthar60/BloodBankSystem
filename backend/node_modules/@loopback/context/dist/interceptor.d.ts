import { MetadataAccessor } from '@loopback/metadata';
import { Binding, BindingTemplate } from './binding';
import { BindingFromClassOptions, BindingSpec } from './binding-inspector';
import { Context } from './context';
import { GenericInterceptor, GenericInterceptorOrKey } from './interceptor-chain';
import { InvocationArgs, InvocationContext, InvocationOptions, InvocationResult } from './invocation';
import { Provider } from './provider';
import { Constructor, ValueOrPromise } from './value-promise';
/**
 * A specialized InvocationContext for interceptors
 */
export declare class InterceptedInvocationContext extends InvocationContext {
    /**
     * Discover all binding keys for global interceptors (tagged by
     * ContextTags.GLOBAL_INTERCEPTOR)
     */
    getGlobalInterceptorBindingKeys(): string[];
    /**
     * Check if the binding for a global interceptor matches the source type
     * of the invocation
     * @param binding - Binding
     */
    private applicableTo;
    /**
     * Sort global interceptor bindings by `globalInterceptorGroup` tags
     * @param bindings - An array of global interceptor bindings
     */
    private sortGlobalInterceptorBindings;
    /**
     * Load all interceptors for the given invocation context. It adds
     * interceptors from possibly three sources:
     * 1. method level `@intercept`
     * 2. class level `@intercept`
     * 3. global interceptors discovered in the context
     */
    loadInterceptors(): InterceptorOrKey[];
}
/**
 * The `BindingTemplate` function to configure a binding as a global interceptor
 * by tagging it with `ContextTags.INTERCEPTOR`
 * @param group - Group for ordering the interceptor
 */
export declare function asGlobalInterceptor(group?: string): BindingTemplate;
/**
 * `@globalInterceptor` decorator to mark the class as a global interceptor
 * @param group - Group for ordering the interceptor
 * @param specs - Extra binding specs
 */
export declare function globalInterceptor(group?: string, ...specs: BindingSpec[]): ClassDecorator;
/**
 * Interceptor function to intercept method invocations
 */
export interface Interceptor extends GenericInterceptor<InvocationContext> {
}
/**
 * Interceptor function or binding key that can be used as parameters for
 * `@intercept()`
 */
export type InterceptorOrKey = GenericInterceptorOrKey<InvocationContext>;
/**
 * Metadata key for method-level interceptors
 */
export declare const INTERCEPT_METHOD_KEY: MetadataAccessor<InterceptorOrKey[], MethodDecorator>;
/**
 * Adding interceptors from the spec to the front of existing ones. Duplicate
 * entries are eliminated from the spec side.
 *
 * For example:
 *
 * - [log] + [cache, log] => [cache, log]
 * - [log] + [log, cache] => [log, cache]
 * - [] + [cache, log] => [cache, log]
 * - [cache, log] + [] => [cache, log]
 * - [log] + [cache] => [log, cache]
 *
 * @param interceptorsFromSpec - Interceptors from `@intercept`
 * @param existingInterceptors - Interceptors already applied for the method
 */
export declare function mergeInterceptors(interceptorsFromSpec: InterceptorOrKey[], existingInterceptors: InterceptorOrKey[]): InterceptorOrKey[];
/**
 * Metadata key for method-level interceptors
 */
export declare const INTERCEPT_CLASS_KEY: MetadataAccessor<InterceptorOrKey[], ClassDecorator>;
/**
 * Decorator function `@intercept` for classes/methods to apply interceptors. It
 * can be applied on a class and its public methods. Multiple occurrences of
 * `@intercept` are allowed on the same target class or method. The decorator
 * takes a list of `interceptor` functions or binding keys.
 *
 * @example
 * ```ts
 * @intercept(log, metrics)
 * class MyController {
 *   @intercept('caching-interceptor')
 *   @intercept('name-validation-interceptor')
 *   greet(name: string) {
 *     return `Hello, ${name}`;
 *   }
 * }
 * ```
 *
 * @param interceptorOrKeys - One or more interceptors or binding keys that are
 * resolved to be interceptors
 */
export declare function intercept(...interceptorOrKeys: InterceptorOrKey[]): (target: any, method?: string, methodDescriptor?: TypedPropertyDescriptor<any>) => any;
/**
 * Invoke a method with the given context
 * @param context - Context object
 * @param target - Target class (for static methods) or object (for instance methods)
 * @param methodName - Method name
 * @param args - An array of argument values
 * @param options - Options for the invocation
 */
export declare function invokeMethodWithInterceptors(context: Context, target: object, methodName: string, args: InvocationArgs, options?: InvocationOptions): ValueOrPromise<InvocationResult>;
/**
 * Options for an interceptor binding
 */
export interface InterceptorBindingOptions extends BindingFromClassOptions {
    /**
     * Global or local interceptor
     */
    global?: boolean;
    /**
     * Group name for a global interceptor
     */
    group?: string;
    /**
     * Source filter for a global interceptor
     */
    source?: string | string[];
}
/**
 * Register an interceptor function or provider class to the given context
 * @param ctx - Context object
 * @param interceptor - An interceptor function or provider class
 * @param options - Options for the interceptor binding
 */
export declare function registerInterceptor(ctx: Context, interceptor: Interceptor | Constructor<Provider<Interceptor>>, options?: InterceptorBindingOptions): Binding<Interceptor>;
