import { Application, Binding, BindingFilter, BindingFromClassOptions, BindingScope, Component, Constructor, Context, MixinTarget } from '@loopback/core';
import { Bootable, Booter, BootOptions, InstanceWithBooters } from '../types';
export { Binding };
/**
 * Mixin for @loopback/boot. This Mixin provides the following:
 * - Implements the Bootable Interface as follows.
 * - Add a `projectRoot` property to the Class
 * - Adds an optional `bootOptions` property to the Class that can be used to
 *    store the Booter conventions.
 * - Adds the `BootComponent` to the Class (which binds the Bootstrapper and default Booters)
 * - Provides the `boot()` convenience method to call Bootstrapper.boot()
 * - Provides the `booter()` convenience method to bind a Booter(s) to the Application
 * - Override `component()` to call `mountComponentBooters`
 * - Adds `mountComponentBooters` which binds Booters to the application from `component.booters[]`
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with boot related methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 */
export declare function BootMixin<T extends MixinTarget<Application>>(superClass: T): {
    new (...args: any[]): {
        projectRoot: string;
        bootOptions?: BootOptions | undefined;
        booted: boolean;
        /**
         * Override to detect and warn about starting without booting.
         */
        start(): Promise<void>;
        /**
         * Convenience method to call bootstrapper.boot() by resolving bootstrapper
         */
        boot(): Promise<void>;
        /**
         * Given a N number of Booter Classes, this method binds them using the
         * prefix and tag expected by the Bootstrapper.
         *
         * @param booterCls - Booter classes to bind to the Application
         *
         * @example
         * ```ts
         * app.booters(MyBooter, MyOtherBooter)
         * ```
         */
        booters(...booterCls: Constructor<Booter>[]): Binding[];
        /**
         * Register a booter to boot a sub-application. See
         * {@link createComponentApplicationBooterBinding} for more details.
         *
         * @param subApp - A sub-application with artifacts to be booted
         * @param filter - A binding filter to select what bindings from the sub
         * application should be added to the main application.
         */
        applicationBooter(subApp: Application & Bootable, filter?: BindingFilter): Binding<Booter>;
        /**
         * Override to ensure any Booter's on a Component are also mounted.
         *
         * @param component - The component to add.
         *
         * @example
         * ```ts
         *
         * export class ProductComponent {
         *   booters = [ControllerBooter, RepositoryBooter];
         *   providers = {
         *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
         *     [AUTHORIZATION_ROLE]: Role,
         *   };
         * };
         *
         * app.component(ProductComponent);
         * ```
         */
        component<C extends Component = Component>(componentCtor: Constructor<C>, nameOrOptions?: string | BindingFromClassOptions): Binding<C>;
        /**
         * Get an instance of a component and mount all it's
         * booters. This function is intended to be used internally
         * by component()
         *
         * @param component - The component to mount booters of
         */
        mountComponentBooters(componentInstanceOrClass: Constructor<unknown> | InstanceWithBooters): void;
        readonly options: import("@loopback/core").ApplicationConfig;
        readonly state: string;
        controller: <T_1>(controllerCtor: import("@loopback/core").ControllerClass<T_1>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_1>;
        server: <T_2 extends import("@loopback/core").Server>(ctor: Constructor<T_2>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_2>;
        servers: <T_3 extends import("@loopback/core").Server>(ctors: Constructor<T_3>[]) => Binding<any>[];
        getServer: <T_4 extends import("@loopback/core").Server>(target: string | Constructor<T_4>) => Promise<T_4>;
        init: () => Promise<void>;
        onInit: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        onStart: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        stop: () => Promise<void>;
        onStop: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        setMetadata: (metadata: import("@loopback/core").ApplicationMetadata) => void;
        lifeCycleObserver: <T_5 extends import("@loopback/core").LifeCycleObserver>(ctor: Constructor<T_5>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_5>;
        service: <S>(cls: import("@loopback/core").ServiceOrProviderClass<S>, nameOrOptions?: string | import("@loopback/core").ServiceOptions | undefined) => Binding<S>;
        interceptor: (interceptor: import("@loopback/core").Interceptor | Constructor<import("@loopback/core").Provider<import("@loopback/core").Interceptor>>, nameOrOptions?: string | import("@loopback/core").InterceptorBindingOptions | undefined) => Binding<import("@loopback/core").Interceptor>;
        readonly name: string;
        readonly subscriptionManager: import("@loopback/core").ContextSubscriptionManager;
        scope: BindingScope;
        readonly parent: Context | undefined;
        emitEvent: <T_6 extends import("@loopback/core").ContextEvent>(type: string, event: T_6) => void;
        emitError: (err: unknown) => void;
        bind: <ValueType = any>(key: import("@loopback/core").BindingAddress<ValueType>) => Binding<ValueType>;
        add: (binding: Binding<unknown>) => Application;
        configure: <ConfigValueType = any>(key?: import("@loopback/core").BindingAddress<unknown> | undefined) => Binding<ConfigValueType>;
        getConfigAsValueOrPromise: <ConfigValueType_1>(key: import("@loopback/core").BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => import("@loopback/core").ValueOrPromise<ConfigValueType_1 | undefined>;
        getConfig: <ConfigValueType_2>(key: import("@loopback/core").BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => Promise<ConfigValueType_2 | undefined>;
        getConfigSync: <ConfigValueType_3>(key: import("@loopback/core").BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => ConfigValueType_3 | undefined;
        unbind: (key: import("@loopback/core").BindingAddress<unknown>) => boolean;
        subscribe: (observer: import("@loopback/core").ContextEventObserver) => import("@loopback/core").Subscription;
        unsubscribe: (observer: import("@loopback/core").ContextEventObserver) => boolean;
        close: () => void;
        isSubscribed: (observer: import("@loopback/core").ContextObserver) => boolean;
        createView: <T_7 = unknown>(filter: BindingFilter, comparator?: import("@loopback/core").BindingComparator | undefined, options?: Omit<import("@loopback/core").ResolutionOptions, "session"> | undefined) => import("@loopback/core").ContextView<T_7>;
        contains: (key: import("@loopback/core").BindingAddress<unknown>) => boolean;
        isBound: (key: import("@loopback/core").BindingAddress<unknown>) => boolean;
        getOwnerContext: (keyOrBinding: Readonly<Binding<unknown>> | import("@loopback/core").BindingAddress<unknown>) => Context | undefined;
        getScopedContext: (scope: BindingScope.APPLICATION | BindingScope.SERVER | BindingScope.REQUEST) => Context | undefined;
        getResolutionContext: (binding: Readonly<Binding<unknown>>) => Context | undefined;
        isVisibleTo: (ctx: Context) => boolean;
        find: <ValueType_1 = any>(pattern?: string | RegExp | BindingFilter | undefined) => Readonly<Binding<ValueType_1>>[];
        findByTag: <ValueType_2 = any>(tagFilter: RegExp | import("@loopback/core").BindingTag) => Readonly<Binding<ValueType_2>>[];
        get: {
            <ValueType_3>(keyWithPath: import("@loopback/core").BindingAddress<ValueType_3>, session?: import("@loopback/core").ResolutionSession | undefined): Promise<ValueType_3>;
            <ValueType_4>(keyWithPath: import("@loopback/core").BindingAddress<ValueType_4>, options: import("@loopback/core").ResolutionOptions): Promise<ValueType_4 | undefined>;
        };
        getSync: {
            <ValueType_5>(keyWithPath: import("@loopback/core").BindingAddress<ValueType_5>, session?: import("@loopback/core").ResolutionSession | undefined): ValueType_5;
            <ValueType_6>(keyWithPath: import("@loopback/core").BindingAddress<ValueType_6>, options?: import("@loopback/core").ResolutionOptions | undefined): ValueType_6 | undefined;
        };
        getBinding: {
            <ValueType_7 = any>(key: import("@loopback/core").BindingAddress<ValueType_7>): Binding<ValueType_7>;
            <ValueType_8>(key: import("@loopback/core").BindingAddress<ValueType_8>, options?: {
                optional?: boolean | undefined;
            } | undefined): Binding<ValueType_8> | undefined;
        };
        findOrCreateBinding: <T_8>(key: import("@loopback/core").BindingAddress<T_8>, policy?: import("@loopback/core").BindingCreationPolicy | undefined) => Binding<T_8>;
        getValueOrPromise: <ValueType_9>(keyWithPath: import("@loopback/core").BindingAddress<ValueType_9>, optionsOrSession?: import("@loopback/core").ResolutionOptionsOrSession | undefined) => import("@loopback/core").ValueOrPromise<ValueType_9 | undefined>;
        toJSON: () => import("@loopback/core").JSONObject;
        inspect: (options?: import("@loopback/core").ContextInspectOptions | undefined) => import("@loopback/core").JSONObject;
        on: {
            (eventName: "bind" | "unbind", listener: import("@loopback/core").ContextEventListener): Application;
            (event: string | symbol, listener: (...args: any[]) => void): Application;
        };
        once: {
            (eventName: "bind" | "unbind", listener: import("@loopback/core").ContextEventListener): Application;
            (event: string | symbol, listener: (...args: any[]) => void): Application;
        };
        addListener: (event: string | symbol, listener: (...args: any[]) => void) => Application;
        removeListener: (event: string | symbol, listener: (...args: any[]) => void) => Application;
        off: (event: string | symbol, listener: (...args: any[]) => void) => Application;
        removeAllListeners: (event?: string | symbol | undefined) => Application;
        setMaxListeners: (n: number) => Application;
        getMaxListeners: () => number;
        listeners: (event: string | symbol) => Function[];
        rawListeners: (event: string | symbol) => Function[];
        emit: (event: string | symbol, ...args: any[]) => boolean;
        listenerCount: (event: string | symbol) => number;
        prependListener: (event: string | symbol, listener: (...args: any[]) => void) => Application;
        prependOnceListener: (event: string | symbol, listener: (...args: any[]) => void) => Application;
        eventNames: () => (string | symbol)[];
    };
} & T;
/**
 * Method which binds a given Booter to a given Context with the Prefix and
 * Tags expected by the Bootstrapper
 *
 * @param ctx - The Context to bind the Booter Class
 * @param booterCls - Booter class to be bound
 */
export declare function bindBooter(ctx: Context, booterCls: Constructor<Booter>): Binding;
export declare const _bindBooter: typeof bindBooter;
