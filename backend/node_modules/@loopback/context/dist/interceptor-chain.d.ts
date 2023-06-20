import { BindingFilter } from './binding-filter';
import { BindingAddress } from './binding-key';
import { BindingComparator } from './binding-sorter';
import { Context } from './context';
import { InvocationResult } from './invocation';
import { ValueOrPromise } from './value-promise';
/**
 * Any type except `void`. We use this type to enforce that interceptor functions
 * always return a value (including undefined or null).
 */
export type NonVoid = string | number | boolean | null | undefined | object;
/**
 * The `next` function that can be used to invoke next generic interceptor in
 * the chain
 */
export type Next = () => ValueOrPromise<NonVoid>;
/**
 * An interceptor function to be invoked in a chain for the given context.
 * It serves as the base interface for various types of interceptors, such
 * as method invocation interceptor or request/response processing interceptor.
 *
 * @remarks
 * We choose `NonVoid` as the return type to avoid possible bugs that an
 * interceptor forgets to return the value from `next()`. For example, the code
 * below will fail to compile.
 *
 * ```ts
 * const myInterceptor: Interceptor = async (ctx, next) {
 *   // preprocessing
 *   // ...
 *
 *   // There is a subtle bug that the result from `next()` is not further
 *   // returned back to the upstream interceptors
 *   const result = await next();
 *
 *   // postprocessing
 *   // ...
 *   // We must have `return ...` here
 *   // either return `result` or another value if the interceptor decides to
 *   // have its own response
 * }
 * ```
 *
 * @typeParam C - `Context` class or a subclass of `Context`
 * @param context - Context object
 * @param next - A function to proceed with downstream interceptors or the
 * target operation
 *
 * @returns The invocation result as a value (sync) or promise (async).
 */
export type GenericInterceptor<C extends Context = Context> = (context: C, next: Next) => ValueOrPromise<NonVoid>;
/**
 * Interceptor function or a binding key that resolves a generic interceptor
 * function
 * @typeParam C - `Context` class or a subclass of `Context`
 * @typeParam T - Return type of `next()`
 */
export type GenericInterceptorOrKey<C extends Context = Context> = BindingAddress<GenericInterceptor<C>> | GenericInterceptor<C>;
/**
 * A chain of generic interceptors to be invoked for the given context
 *
 * @typeParam C - `Context` class or a subclass of `Context`
 */
export declare class GenericInterceptorChain<C extends Context = Context> {
    private context;
    /**
     * A getter for an array of interceptor functions or binding keys
     */
    protected getInterceptors: () => GenericInterceptorOrKey<C>[];
    /**
     * Create an invocation chain with a list of interceptor functions or
     * binding keys
     * @param context - Context object
     * @param interceptors - An array of interceptor functions or binding keys
     */
    constructor(context: C, interceptors: GenericInterceptorOrKey<C>[]);
    /**
     * Create an invocation interceptor chain with a binding filter and comparator.
     * The interceptors are discovered from the context using the binding filter and
     * sorted by the comparator (if provided).
     *
     * @param context - Context object
     * @param filter - A binding filter function to select interceptors
     * @param comparator - An optional comparator to sort matched interceptor bindings
     */
    constructor(context: C, filter: BindingFilter, comparator?: BindingComparator);
    /**
     * Invoke the interceptor chain
     */
    invokeInterceptors(finalHandler?: Next): ValueOrPromise<InvocationResult>;
    /**
     * Use the interceptor chain as an interceptor
     */
    asInterceptor(): GenericInterceptor<C>;
    /**
     * Invoke downstream interceptors or the target method
     */
    private next;
    /**
     * Invoke downstream interceptors
     */
    private invokeNextInterceptor;
    /**
     * Return the interceptor function or resolve the interceptor function as a binding
     * from the context
     *
     * @param interceptor - Interceptor function or binding key
     */
    private loadInterceptor;
}
/**
 * Invoke a chain of interceptors with the context
 * @param context - Context object
 * @param interceptors - An array of interceptor functions or binding keys
 */
export declare function invokeInterceptors<C extends Context = Context, T = InvocationResult>(context: C, interceptors: GenericInterceptorOrKey<C>[]): ValueOrPromise<T | undefined>;
/**
 * Compose a list of interceptors as a single interceptor
 * @param interceptors - A list of interceptor functions or binding keys
 */
export declare function composeInterceptors<C extends Context = Context>(...interceptors: GenericInterceptorOrKey<C>[]): GenericInterceptor<C>;
