import { Application, Binding, BindingAddress, BindingFromClassOptions, Component, Constructor, MixinTarget, Provider, ServiceOptions } from '@loopback/core';
/**
 * Interface for classes with `new` operator.
 */
export interface Class<T> {
    new (...args: any[]): T;
}
/**
 * A mixin class for Application that creates a .serviceProvider()
 * function to register a service automatically. Also overrides
 * component function to allow it to register repositories automatically.
 *
 * @example
 * ```ts
 * class MyApplication extends ServiceMixin(Application) {}
 * ```
 *
 * Please note: the members in the mixin function are documented in a dummy class
 * called <a href="#ServiceMixinDoc">ServiceMixinDoc</a>
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with service proxy related
 * methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 */
export declare function ServiceMixin<T extends MixinTarget<Application>>(superClass: T): {
    new (...args: any[]): {
        /**
         * Add a service to this application.
         *
         * @deprecated Use app.service() instead
         *
         * @param provider - The service provider to register.
         *
         * @example
         * ```ts
         * export interface GeocoderService {
         *   geocode(address: string): Promise<GeoPoint[]>;
         * }
         *
         * export class GeocoderServiceProvider implements Provider<GeocoderService> {
         *   constructor(
         *     @inject('services.geocoder')
         *     protected dataSource: juggler.DataSource = new GeocoderDataSource(),
         *   ) {}
         *
         *   value(): Promise<GeocoderService> {
         *     return getService(this.dataSource);
         *   }
         * }
         *
         * app.serviceProvider(GeocoderServiceProvider);
         * ```
         */
        serviceProvider<S>(provider: Constructor<Provider<S>>, nameOrOptions?: string | ServiceOptions): Binding<S>;
        /**
         * Add a component to this application. Also mounts
         * all the components services.
         *
         * @param component - The component to add.
         *
         * @example
         * ```ts
         *
         * export class ProductComponent {
         *   controllers = [ProductController];
         *   repositories = [ProductRepo, UserRepo];
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
         * services. This function is intended to be used internally
         * by component()
         *
         * @param component - The component to mount services of
         */
        mountComponentServices<C_1 extends Component = Component>(component: Constructor<C_1>, componentBindingKey?: BindingAddress<C_1> | undefined): void;
        readonly options: import("@loopback/core").ApplicationConfig;
        readonly state: string;
        controller: <T_1>(controllerCtor: import("@loopback/core").ControllerClass<T_1>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_1>;
        server: <T_2 extends import("@loopback/core").Server>(ctor: Constructor<T_2>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_2>;
        servers: <T_3 extends import("@loopback/core").Server>(ctors: Constructor<T_3>[]) => Binding<any>[];
        getServer: <T_4 extends import("@loopback/core").Server>(target: string | Constructor<T_4>) => Promise<T_4>;
        init: () => Promise<void>;
        onInit: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        start: () => Promise<void>;
        onStart: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        stop: () => Promise<void>;
        onStop: (fn: () => import("@loopback/core").ValueOrPromise<void>) => Binding<import("@loopback/core").LifeCycleObserver>;
        setMetadata: (metadata: import("@loopback/core").ApplicationMetadata) => void;
        lifeCycleObserver: <T_5 extends import("@loopback/core").LifeCycleObserver>(ctor: Constructor<T_5>, nameOrOptions?: string | BindingFromClassOptions | undefined) => Binding<T_5>;
        service: <S_1>(cls: import("@loopback/core").ServiceOrProviderClass<S_1>, nameOrOptions?: string | ServiceOptions | undefined) => Binding<S_1>;
        interceptor: (interceptor: import("@loopback/core").Interceptor | Constructor<Provider<import("@loopback/core").Interceptor>>, nameOrOptions?: string | import("@loopback/core").InterceptorBindingOptions | undefined) => Binding<import("@loopback/core").Interceptor>;
        readonly name: string;
        readonly subscriptionManager: import("@loopback/core").ContextSubscriptionManager;
        scope: import("@loopback/core").BindingScope;
        readonly parent: import("@loopback/core").Context | undefined;
        emitEvent: <T_6 extends import("@loopback/core").ContextEvent>(type: string, event: T_6) => void;
        emitError: (err: unknown) => void;
        bind: <ValueType = any>(key: BindingAddress<ValueType>) => Binding<ValueType>;
        add: (binding: Binding<unknown>) => Application;
        configure: <ConfigValueType = any>(key?: BindingAddress<unknown> | undefined) => Binding<ConfigValueType>;
        getConfigAsValueOrPromise: <ConfigValueType_1>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => import("@loopback/core").ValueOrPromise<ConfigValueType_1 | undefined>;
        getConfig: <ConfigValueType_2>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => Promise<ConfigValueType_2 | undefined>;
        getConfigSync: <ConfigValueType_3>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => ConfigValueType_3 | undefined;
        unbind: (key: BindingAddress<unknown>) => boolean;
        subscribe: (observer: import("@loopback/core").ContextEventObserver) => import("@loopback/core").Subscription;
        unsubscribe: (observer: import("@loopback/core").ContextEventObserver) => boolean;
        close: () => void;
        isSubscribed: (observer: import("@loopback/core").ContextObserver) => boolean;
        createView: <T_7 = unknown>(filter: import("@loopback/core").BindingFilter, comparator?: import("@loopback/core").BindingComparator | undefined, options?: Omit<import("@loopback/core").ResolutionOptions, "session"> | undefined) => import("@loopback/core").ContextView<T_7>;
        contains: (key: BindingAddress<unknown>) => boolean;
        isBound: (key: BindingAddress<unknown>) => boolean;
        getOwnerContext: (keyOrBinding: BindingAddress<unknown> | Readonly<Binding<unknown>>) => import("@loopback/core").Context | undefined;
        getScopedContext: (scope: import("@loopback/core").BindingScope.APPLICATION | import("@loopback/core").BindingScope.SERVER | import("@loopback/core").BindingScope.REQUEST) => import("@loopback/core").Context | undefined;
        getResolutionContext: (binding: Readonly<Binding<unknown>>) => import("@loopback/core").Context | undefined;
        isVisibleTo: (ctx: import("@loopback/core").Context) => boolean;
        find: <ValueType_1 = any>(pattern?: string | RegExp | import("@loopback/core").BindingFilter | undefined) => Readonly<Binding<ValueType_1>>[];
        findByTag: <ValueType_2 = any>(tagFilter: RegExp | import("@loopback/core").BindingTag) => Readonly<Binding<ValueType_2>>[];
        get: {
            <ValueType_3>(keyWithPath: BindingAddress<ValueType_3>, session?: import("@loopback/core").ResolutionSession | undefined): Promise<ValueType_3>;
            <ValueType_4>(keyWithPath: BindingAddress<ValueType_4>, options: import("@loopback/core").ResolutionOptions): Promise<ValueType_4 | undefined>;
        };
        getSync: {
            <ValueType_5>(keyWithPath: BindingAddress<ValueType_5>, session?: import("@loopback/core").ResolutionSession | undefined): ValueType_5;
            <ValueType_6>(keyWithPath: BindingAddress<ValueType_6>, options?: import("@loopback/core").ResolutionOptions | undefined): ValueType_6 | undefined;
        };
        getBinding: {
            <ValueType_7 = any>(key: BindingAddress<ValueType_7>): Binding<ValueType_7>;
            <ValueType_8>(key: BindingAddress<ValueType_8>, options?: {
                optional?: boolean | undefined;
            } | undefined): Binding<ValueType_8> | undefined;
        };
        findOrCreateBinding: <T_8>(key: BindingAddress<T_8>, policy?: import("@loopback/core").BindingCreationPolicy | undefined) => Binding<T_8>;
        getValueOrPromise: <ValueType_9>(keyWithPath: BindingAddress<ValueType_9>, optionsOrSession?: import("@loopback/core").ResolutionOptionsOrSession | undefined) => import("@loopback/core").ValueOrPromise<ValueType_9 | undefined>;
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
 * Interface for an Application mixed in with ServiceMixin
 */
export interface ApplicationWithServices extends Application {
    serviceProvider<S>(provider: Constructor<Provider<S>>, name?: string): Binding<S>;
    component(component: Constructor<{}>, name?: string): Binding;
    mountComponentServices(component: Constructor<{}>): void;
}
/**
 * A dummy class created to generate the tsdoc for the members in service
 * mixin. Please don't use it.
 *
 * The members are implemented in function
 * <a href="#ServiceMixin">ServiceMixin</a>
 */
export declare class ServiceMixinDoc {
    constructor(...args: any[]);
    /**
     * Add a service to this application.
     *
     * @param provider - The service provider to register.
     *
     * @example
     * ```ts
     * export interface GeocoderService {
     *   geocode(address: string): Promise<GeoPoint[]>;
     * }
     *
     * export class GeocoderServiceProvider implements Provider<GeocoderService> {
     *   constructor(
     *     @inject('datasources.geocoder')
     *     protected dataSource: juggler.DataSource = new GeocoderDataSource(),
     *   ) {}
     *
     *   value(): Promise<GeocoderService> {
     *     return getService(this.dataSource);
     *   }
     * }
     *
     * app.serviceProvider(GeocoderServiceProvider);
     * ```
     */
    serviceProvider<S>(provider: Constructor<Provider<S>>): Binding<S>;
    /**
     * Add a component to this application. Also mounts
     * all the components services.
     *
     * @param component - The component to add.
     *
     * @example
     * ```ts
     *
     * export class ProductComponent {
     *   controllers = [ProductController];
     *   repositories = [ProductRepo, UserRepo];
     *   providers = {
     *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
     *     [AUTHORIZATION_ROLE]: Role,
     *   };
     * };
     *
     * app.component(ProductComponent);
     * ```
     */
    component(component: Constructor<unknown>): Binding;
    /**
     * Get an instance of a component and mount all it's
     * services. This function is intended to be used internally
     * by component()
     *
     * @param component - The component to mount services of
     */
    mountComponentServices(component: Constructor<unknown>): void;
}
