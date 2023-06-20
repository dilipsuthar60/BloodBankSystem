import { MetadataAccessor } from '@loopback/metadata';
import { Binding, BindingScope, BindingTag, BindingTemplate, DynamicValueProviderClass } from './binding';
import { BindingAddress } from './binding-key';
import { Provider } from './provider';
import { Constructor } from './value-promise';
/**
 * Binding metadata from `@injectable`
 *
 * @typeParam T - Value type
 */
export type BindingMetadata<T = unknown> = {
    /**
     * An array of template functions to configure a binding
     */
    templates: BindingTemplate<T>[];
    /**
     * The target class where binding metadata is decorated
     */
    target: Constructor<T>;
};
/**
 * Metadata key for binding metadata
 */
export declare const BINDING_METADATA_KEY: MetadataAccessor<BindingMetadata<unknown>, ClassDecorator>;
/**
 * An object to configure binding scope and tags
 */
export type BindingScopeAndTags = {
    scope?: BindingScope;
    tags?: BindingTag | BindingTag[];
};
/**
 * Specification of parameters for `@injectable()`
 */
export type BindingSpec<T = unknown> = BindingTemplate<T> | BindingScopeAndTags;
/**
 * Check if a class implements `Provider` interface
 * @param cls - A class
 *
 * @typeParam T - Value type
 */
export declare function isProviderClass<T>(cls: unknown): cls is Constructor<Provider<T>>;
/**
 * A factory function to create a template function to bind the target class
 * as a `Provider`.
 * @param target - Target provider class
 *
 * @typeParam T - Value type
 */
export declare function asProvider<T>(target: Constructor<Provider<T>>): BindingTemplate<T>;
/**
 * A factory function to create a template function to bind the target class
 * as a class or `Provider`.
 * @param target - Target class, which can be an implementation of `Provider`
 * or `DynamicValueProviderClass`
 *
 * @typeParam T - Value type
 */
export declare function asClassOrProvider<T>(target: Constructor<T | Provider<T>> | DynamicValueProviderClass<T>): BindingTemplate<T>;
/**
 * Convert binding scope and tags as a template function
 * @param scopeAndTags - Binding scope and tags
 *
 * @typeParam T - Value type
 */
export declare function asBindingTemplate<T = unknown>(scopeAndTags: BindingScopeAndTags): BindingTemplate<T>;
/**
 * Get binding metadata for a class
 * @param target - The target class
 *
 * @typeParam T - Value type
 */
export declare function getBindingMetadata<T = unknown>(target: Function): BindingMetadata<T> | undefined;
/**
 * A binding template function to delete `name` and `key` tags
 */
export declare function removeNameAndKeyTags(binding: Binding<unknown>): void;
/**
 * Get the binding template for a class with binding metadata
 *
 * @param cls - A class with optional `@injectable`
 *
 * @typeParam T - Value type
 */
export declare function bindingTemplateFor<T>(cls: Constructor<T | Provider<T>> | DynamicValueProviderClass<T>, options?: BindingFromClassOptions): BindingTemplate<T>;
/**
 * Mapping artifact types to binding key namespaces (prefixes).
 *
 * @example
 * ```ts
 * {
 *   repository: 'repositories'
 * }
 * ```
 */
export type TypeNamespaceMapping = {
    [name: string]: string;
};
export declare const DEFAULT_TYPE_NAMESPACES: TypeNamespaceMapping;
/**
 * Options to customize the binding created from a class
 */
export type BindingFromClassOptions = {
    /**
     * Binding key
     */
    key?: BindingAddress;
    /**
     * Artifact type, such as `server`, `controller`, `repository` or `service`
     */
    type?: string;
    /**
     * Artifact name, such as `my-rest-server` and `my-controller`. It
     * overrides the name tag
     */
    name?: string;
    /**
     * Namespace for the binding key, such as `servers` and `controllers`. It
     * overrides the default namespace or namespace tag
     */
    namespace?: string;
    /**
     * Mapping artifact type to binding key namespaces
     */
    typeNamespaceMapping?: TypeNamespaceMapping;
    /**
     * Default namespace if the binding does not have an explicit namespace
     */
    defaultNamespace?: string;
    /**
     * Default scope if the binding does not have an explicit scope
     */
    defaultScope?: BindingScope;
};
/**
 * Create a binding from a class with decorated metadata. The class is attached
 * to the binding as follows:
 * - `binding.toClass(cls)`: if `cls` is a plain class such as `MyController`
 * - `binding.toProvider(cls)`: if `cls` is a value provider class with a
 * prototype method `value()`
 * - `binding.toDynamicValue(cls)`: if `cls` is a dynamic value provider class
 * with a static method `value()`
 *
 * @param cls - A class. It can be either a plain class, a value provider class,
 * or a dynamic value provider class
 * @param options - Options to customize the binding key
 *
 * @typeParam T - Value type
 */
export declare function createBindingFromClass<T>(cls: Constructor<T | Provider<T>> | DynamicValueProviderClass<T>, options?: BindingFromClassOptions): Binding<T>;
