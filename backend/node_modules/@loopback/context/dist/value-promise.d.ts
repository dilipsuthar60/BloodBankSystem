/**
 * A class constructor accepting arbitrary arguments.
 */
export type Constructor<T> = new (...args: any[]) => T;
export type BoundValue = any;
/**
 * Representing a value or promise. This type is used to represent results of
 * synchronous/asynchronous resolution of values.
 *
 * Note that we are using PromiseLike instead of native Promise to describe
 * the asynchronous variant. This allows producers of async values to use
 * any Promise implementation (e.g. Bluebird) instead of native Promises
 * provided by JavaScript runtime.
 */
export type ValueOrPromise<T> = T | PromiseLike<T>;
export type MapObject<T> = Record<string, T>;
/**
 * Check whether a value is a Promise-like instance.
 * Recognizes both native promises and third-party promise libraries.
 *
 * @param value - The value to check.
 */
export declare function isPromiseLike<T>(value: T | PromiseLike<T> | undefined): value is PromiseLike<T>;
/**
 * Get nested properties of an object by path
 * @param value - Value of the source object
 * @param path - Path to the property
 */
export declare function getDeepProperty<OUT = BoundValue, IN = BoundValue>(value: IN, path: string): OUT | undefined;
/**
 * Resolve entries of an object into a new object with the same keys. If one or
 * more entries of the source object are resolved to a promise by the `resolver`
 * function, this method returns a promise which will be resolved to the new
 * object with fully resolved entries.
 *
 * @example
 *
 * - Example 1: resolve all entries synchronously
 * ```ts
 * const result = resolveMap({a: 'x', b: 'y'}, v => v.toUpperCase());
 * ```
 * The `result` will be `{a: 'X', b: 'Y'}`.
 *
 * - Example 2: resolve one or more entries asynchronously
 * ```ts
 * const result = resolveMap({a: 'x', b: 'y'}, v =>
 *   Promise.resolve(v.toUpperCase()),
 * );
 * ```
 * The `result` will be a promise of `{a: 'X', b: 'Y'}`.
 *
 * @param map - The original object containing the source entries
 * @param resolver - A function resolves an entry to a value or promise. It will
 * be invoked with the property value, the property name, and the source object.
 */
export declare function resolveMap<T, V>(map: MapObject<T>, resolver: (val: T, key: string, values: MapObject<T>) => ValueOrPromise<V>): ValueOrPromise<MapObject<V>>;
/**
 * Resolve entries of an array into a new array with the same indexes. If one or
 * more entries of the source array are resolved to a promise by the `resolver`
 * function, this method returns a promise which will be resolved to the new
 * array with fully resolved entries.
 *
 * @example
 *
 * - Example 1: resolve all entries synchronously
 * ```ts
 * const result = resolveList(['a', 'b'], v => v.toUpperCase());
 * ```
 * The `result` will be `['A', 'B']`.
 *
 * - Example 2: resolve one or more entries asynchronously
 * ```ts
 * const result = resolveList(['a', 'b'], v =>
 *   Promise.resolve(v.toUpperCase()),
 * );
 * ```
 * The `result` will be a promise of `['A', 'B']`.
 *
 * @param list - The original array containing the source entries
 * @param resolver - A function resolves an entry to a value or promise. It will
 * be invoked with the property value, the property index, and the source array.
 */
export declare function resolveList<T, V>(list: T[], resolver: (val: T, index: number, values: T[]) => ValueOrPromise<V>): ValueOrPromise<V[]>;
/**
 * Try to run an action that returns a promise or a value
 * @param action - A function that returns a promise or a value
 * @param finalAction - A function to be called once the action
 * is fulfilled or rejected (synchronously or asynchronously)
 *
 *  @typeParam T - Type for the return value
 */
export declare function tryWithFinally<T>(action: () => ValueOrPromise<T>, finalAction: () => void): ValueOrPromise<T>;
/**
 * Try to run an action that returns a promise or a value with error and final
 * actions to mimic `try {} catch(err) {} finally {}` for a value or promise.
 *
 * @param action - A function that returns a promise or a value
 * @param errorAction - A function to be called once the action
 * is rejected (synchronously or asynchronously). It must either return a new
 * value or throw an error.
 * @param finalAction - A function to be called once the action
 * is fulfilled or rejected (synchronously or asynchronously)
 *
 * @typeParam T - Type for the return value
 */
export declare function tryCatchFinally<T>(action: () => ValueOrPromise<T>, errorAction?: (err: unknown) => T | never, finalAction?: () => void): ValueOrPromise<T>;
/**
 * Resolve an iterator of source values into a result until the evaluator
 * returns `true`
 * @param source - The iterator of source values
 * @param resolver - The resolve function that maps the source value to a result
 * @param evaluator - The evaluate function that decides when to stop
 */
export declare function resolveUntil<T, V>(source: Iterator<T>, resolver: (sourceVal: T) => ValueOrPromise<V | undefined>, evaluator: (sourceVal: T, targetVal: V | undefined) => boolean): ValueOrPromise<V | undefined>;
/**
 * Transform a value or promise with a function that produces a new value or
 * promise
 * @param valueOrPromise - The value or promise
 * @param transformer - A function that maps the source value to a value or promise
 */
export declare function transformValueOrPromise<T, V>(valueOrPromise: ValueOrPromise<T>, transformer: (val: T) => ValueOrPromise<V>): ValueOrPromise<V>;
/**
 * A utility to generate uuid v4
 *
 * @deprecated Use `generateUniqueId`, [uuid](https://www.npmjs.com/package/uuid)
 * or [hyperid](https://www.npmjs.com/package/hyperid) instead.
 */
export declare function uuid(): string;
/**
 * A regular expression for testing uuid v4 PATTERN
 * @deprecated This pattern is an internal helper used by unit-tests, we are no
 * longer using it.
 */
export declare const UUID_PATTERN: RegExp;
