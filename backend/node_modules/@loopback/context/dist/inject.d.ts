import { MetadataMap } from '@loopback/metadata';
import { Binding, BindingTag } from './binding';
import { BindingFilter, BindingSelector } from './binding-filter';
import { BindingAddress, BindingKey } from './binding-key';
import { BindingComparator } from './binding-sorter';
import { BindingCreationPolicy, Context } from './context';
import { JSONObject } from './json-types';
import { ResolutionOptions, ResolutionSession } from './resolution-session';
import { BoundValue, Constructor, ValueOrPromise } from './value-promise';
/**
 * A function to provide resolution of injected values.
 *
 * @example
 * ```ts
 * const resolver: ResolverFunction = (ctx, injection, session) {
 *   return session.currentBinding?.key;
 * }
 * ```
 */
export interface ResolverFunction {
    (ctx: Context, injection: Readonly<Injection>, session: ResolutionSession): ValueOrPromise<BoundValue>;
}
/**
 * An object to provide metadata for `@inject`
 */
export interface InjectionMetadata extends Omit<ResolutionOptions, 'session'> {
    /**
     * Name of the decorator function, such as `@inject` or `@inject.setter`.
     * It's usually set by the decorator implementation.
     */
    decorator?: string;
    /**
     * Optional comparator for matched bindings
     */
    bindingComparator?: BindingComparator;
    /**
     * Other attributes
     */
    [attribute: string]: BoundValue;
}
/**
 * Descriptor for an injection point
 */
export interface Injection<ValueType = BoundValue> {
    target: Object;
    member?: string;
    methodDescriptorOrParameterIndex?: TypedPropertyDescriptor<ValueType> | number;
    bindingSelector: BindingSelector<ValueType>;
    metadata: InjectionMetadata;
    resolve?: ResolverFunction;
}
/**
 * A decorator to annotate method arguments for automatic injection
 * by LoopBack IoC container.
 *
 * @example
 * Usage - Typescript:
 *
 * ```ts
 * class InfoController {
 *   @inject('authentication.user') public userName: string;
 *
 *   constructor(@inject('application.name') public appName: string) {
 *   }
 *   // ...
 * }
 * ```
 *
 * Usage - JavaScript:
 *
 *  - TODO(bajtos)
 *
 * @param bindingSelector - What binding to use in order to resolve the value of the
 * decorated constructor parameter or property.
 * @param metadata - Optional metadata to help the injection
 * @param resolve - Optional function to resolve the injection
 *
 */
export declare function inject(bindingSelector: BindingSelector, metadata?: InjectionMetadata, resolve?: ResolverFunction): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: TypedPropertyDescriptor<BoundValue> | number) => void;
/**
 * The function injected by `@inject.getter(bindingSelector)`. It can be used
 * to fetch bound value(s) from the underlying binding(s). The return value will
 * be an array if the `bindingSelector` is a `BindingFilter` function.
 */
export type Getter<T> = () => Promise<T>;
export declare namespace Getter {
    /**
     * Convert a value into a Getter returning that value.
     * @param value
     */
    function fromValue<T>(value: T): Getter<T>;
}
/**
 * The function injected by `@inject.setter(bindingKey)`. It sets the underlying
 * binding to a constant value using `binding.to(value)`.
 *
 * @example
 *
 * ```ts
 * setterFn('my-value');
 * ```
 * @param value - The value for the underlying binding
 */
export type Setter<T> = (value: T) => void;
/**
 * Metadata for `@inject.binding`
 */
export interface InjectBindingMetadata extends InjectionMetadata {
    /**
     * Controls how the underlying binding is resolved/created
     */
    bindingCreation?: BindingCreationPolicy;
}
export declare namespace inject {
    /**
     * Inject a function for getting the actual bound value.
     *
     * This is useful when implementing Actions, where
     * the action is instantiated for Sequence constructor, but some
     * of action's dependencies become bound only after other actions
     * have been executed by the sequence.
     *
     * See also `Getter<T>`.
     *
     * @param bindingSelector - The binding key or filter we want to eventually get
     * value(s) from.
     * @param metadata - Optional metadata to help the injection
     */
    const getter: (bindingSelector: BindingSelector<unknown>, metadata?: InjectionMetadata) => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    /**
     * Inject a function for setting (binding) the given key to a given
     * value. (Only static/constant values are supported, it's not possible
     * to bind a key to a class or a provider.)
     *
     * This is useful e.g. when implementing Actions that are contributing
     * new Elements.
     *
     * See also `Setter<T>`.
     *
     * @param bindingKey - The key of the value we want to set.
     * @param metadata - Optional metadata to help the injection
     */
    const setter: (bindingKey: BindingAddress, metadata?: InjectBindingMetadata) => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    /**
     * Inject the binding object for the given key. This is useful if a binding
     * needs to be set up beyond just a constant value allowed by
     * `@inject.setter`. The injected binding is found or created based on the
     * `metadata.bindingCreation` option. See `BindingCreationPolicy` for more
     * details.
     *
     * @example
     *
     * ```ts
     * class MyAuthAction {
     *   @inject.binding('current-user', {
     *     bindingCreation: BindingCreationPolicy.ALWAYS_CREATE,
     *   })
     *   private userBinding: Binding<UserProfile>;
     *
     *   async authenticate() {
     *     this.userBinding.toDynamicValue(() => {...});
     *   }
     * }
     * ```
     *
     * @param bindingKey - Binding key
     * @param metadata - Metadata for the injection
     */
    const binding: (bindingKey?: string | BindingKey<unknown>, metadata?: InjectBindingMetadata) => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    /**
     * Inject an array of values by a tag pattern string or regexp
     *
     * @example
     * ```ts
     * class AuthenticationManager {
     *   constructor(
     *     @inject.tag('authentication.strategy') public strategies: Strategy[],
     *   ) {}
     * }
     * ```
     * @param bindingTag - Tag name, regex or object
     * @param metadata - Optional metadata to help the injection
     */
    const tag: (bindingTag: BindingTag | RegExp, metadata?: InjectionMetadata) => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    /**
     * Inject matching bound values by the filter function
     *
     * @example
     * ```ts
     * class MyControllerWithView {
     *   @inject.view(filterByTag('foo'))
     *   view: ContextView<string[]>;
     * }
     * ```
     * @param bindingFilter - A binding filter function
     * @param metadata
     */
    const view: (bindingFilter: BindingFilter, metadata?: InjectionMetadata) => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    /**
     * Inject the context object.
     *
     * @example
     * ```ts
     * class MyProvider {
     *  constructor(@inject.context() private ctx: Context) {}
     * }
     * ```
     */
    const context: () => (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
}
/**
 * Assert the target type inspected from TypeScript for injection to be the
 * expected type. If the types don't match, an error is thrown.
 * @param injection - Injection information
 * @param expectedType - Expected type
 * @param expectedTypeName - Name of the expected type to be used in the error
 * @returns The name of the target
 */
export declare function assertTargetType(injection: Readonly<Injection>, expectedType: Function, expectedTypeName?: string): string;
/**
 * Return an array of injection objects for parameters
 * @param target - The target class for constructor or static methods,
 * or the prototype for instance methods
 * @param method - Method name, undefined for constructor
 */
export declare function describeInjectedArguments(target: Object, method?: string): Readonly<Injection>[];
/**
 * Inspect the target type for the injection to find out the corresponding
 * JavaScript type
 * @param injection - Injection information
 */
export declare function inspectTargetType(injection: Readonly<Injection>): Function | undefined;
/**
 * Return a map of injection objects for properties
 * @param target - The target class for static properties or
 * prototype for instance properties.
 */
export declare function describeInjectedProperties(target: Object): MetadataMap<Readonly<Injection>>;
/**
 * Inspect injections for a binding created with `toClass` or `toProvider`
 * @param binding - Binding object
 */
export declare function inspectInjections(binding: Readonly<Binding<unknown>>): JSONObject;
/**
 * Check if the given class has `@inject` or other decorations that map to
 * `@inject`.
 *
 * @param cls - Class with possible `@inject` decorations
 */
export declare function hasInjections(cls: Constructor<unknown>): boolean;
