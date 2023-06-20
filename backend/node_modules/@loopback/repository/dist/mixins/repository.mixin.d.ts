import { Application, Binding, BindingFromClassOptions, BindingScope, Component, Constructor, MixinTarget } from '@loopback/core';
import { Class } from '../common-types';
import { SchemaMigrationOptions } from '../datasource';
import { Model } from '../model';
import { juggler, Repository } from '../repositories';
/**
 * A mixin class for Application that creates a .repository()
 * function to register a repository automatically. Also overrides
 * component function to allow it to register repositories automatically.
 *
 * @example
 * ```ts
 * class MyApplication extends RepositoryMixin(Application) {}
 * ```
 *
 * Please note: the members in the mixin function are documented in a dummy class
 * called <a href="#RepositoryMixinDoc">RepositoryMixinDoc</a>
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with repository related
 * methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 *
 */
export declare function RepositoryMixin<T extends MixinTarget<Application>>(superClass: T): {
    new (...args: any[]): {
        /**
         * Add a repository to this application.
         *
         * @param repoClass - The repository to add.
         * @param nameOrOptions - Name or options for the binding
         *
         * @example
         * ```ts
         *
         * class NoteRepo {
         *   model: any;
         *
         *   constructor() {
         *     const ds: juggler.DataSource = new juggler.DataSource({
         *       name: 'db',
         *       connector: 'memory',
         *     });
         *
         *     this.model = ds.createModel(
         *       'note',
         *       {title: 'string', content: 'string'},
         *       {}
         *     );
         *   }
         * };
         *
         * app.repository(NoteRepo);
         * ```
         */
        repository<R extends Repository<any>>(repoClass: Class<R>, nameOrOptions?: string | BindingFromClassOptions): Binding<R>;
        /**
         * Retrieve the repository instance from the given Repository class
         *
         * @param repo - The repository class to retrieve the instance of
         */
        getRepository<R_1 extends Repository<any>>(repo: Class<R_1>): Promise<R_1>;
        /**
         * Add the dataSource to this application.
         *
         * @param dataSource - The dataSource to add.
         * @param nameOrOptions - The binding name or options of the datasource;
         * defaults to dataSource.name
         *
         * @example
         * ```ts
         *
         * const ds: juggler.DataSource = new juggler.DataSource({
         *   name: 'db',
         *   connector: 'memory',
         * });
         *
         * app.dataSource(ds);
         *
         * // The datasource can be injected with
         * constructor(@inject('datasources.db') dataSource: DataSourceType) {
         *
         * }
         * ```
         */
        dataSource<D extends juggler.DataSource>(dataSource: D | Class<D>, nameOrOptions?: string | BindingFromClassOptions): Binding<D>;
        /**
         * Register a model class as a binding in the target context
         * @param modelClass - Model class
         */
        model<M extends Class<unknown>>(modelClass: M): Binding<M>;
        /**
         * Add a component to this application. Also mounts
         * all the components repositories.
         *
         * @param component - The component to add.
         * @param nameOrOptions - Name or options for the binding.
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
         * repositories. This function is intended to be used internally
         * by `component()`.
         *
         * NOTE: Calling `mountComponentRepositories` with a component class
         * constructor is deprecated. You should instantiate the component
         * yourself and provide the component instance instead.
         *
         * @param componentInstanceOrClass - The component to mount repositories of
         * @internal
         */
        mountComponentRepositories(componentInstanceOrClass: Class<unknown> | RepositoryComponent): void;
        /**
         * Bind all model classes provided by a component.
         * @param component
         * @internal
         */
        mountComponentModels(component: RepositoryComponent): void;
        /**
         * Update or recreate the database schema for all repositories.
         *
         * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
         * while updating the schema in your target database, but this is not
         * guaranteed to be safe.
         *
         * Please check the documentation for your specific connector(s) for
         * a detailed breakdown of behaviors for automigrate!
         *
         * @param options - Migration options, e.g. whether to update tables
         * preserving data or rebuild everything from scratch.
         */
        migrateSchema(options?: SchemaMigrationOptions): Promise<void>;
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
        service: <S>(cls: import("@loopback/core").ServiceOrProviderClass<S>, nameOrOptions?: string | import("@loopback/core").ServiceOptions | undefined) => Binding<S>;
        interceptor: (interceptor: import("@loopback/core").Interceptor | Constructor<import("@loopback/core").Provider<import("@loopback/core").Interceptor>>, nameOrOptions?: string | import("@loopback/core").InterceptorBindingOptions | undefined) => Binding<import("@loopback/core").Interceptor>;
        readonly name: string;
        readonly subscriptionManager: import("@loopback/core").ContextSubscriptionManager;
        scope: BindingScope;
        readonly parent: import("@loopback/core").Context | undefined;
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
        createView: <T_7 = unknown>(filter: import("@loopback/core").BindingFilter, comparator?: import("@loopback/core").BindingComparator | undefined, options?: Omit<import("@loopback/core").ResolutionOptions, "session"> | undefined) => import("@loopback/core").ContextView<T_7>;
        contains: (key: import("@loopback/core").BindingAddress<unknown>) => boolean;
        isBound: (key: import("@loopback/core").BindingAddress<unknown>) => boolean;
        getOwnerContext: (keyOrBinding: import("@loopback/core").BindingAddress<unknown> | Readonly<Binding<unknown>>) => import("@loopback/core").Context | undefined;
        getScopedContext: (scope: BindingScope.APPLICATION | BindingScope.SERVER | BindingScope.REQUEST) => import("@loopback/core").Context | undefined;
        getResolutionContext: (binding: Readonly<Binding<unknown>>) => import("@loopback/core").Context | undefined;
        isVisibleTo: (ctx: import("@loopback/core").Context) => boolean;
        find: <ValueType_1 = any>(pattern?: string | RegExp | import("@loopback/core").BindingFilter | undefined) => Readonly<Binding<ValueType_1>>[];
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
 * This interface describes additional Component properties
 * allowing components to contribute Repository-related artifacts.
 */
export interface RepositoryComponent {
    /**
     * An optional list of Repository classes to bind for dependency injection
     * via `app.repository()` API.
     */
    repositories?: Class<Repository<Model>>[];
    /**
     * An optional list of Model classes to bind for dependency injection
     * via `app.model()` API.
     */
    models?: Class<Model>[];
}
/**
 * Interface for an Application mixed in with RepositoryMixin
 */
export interface ApplicationWithRepositories extends Application {
    repository<R extends Repository<any>>(repo: Class<R>, name?: string): Binding<R>;
    getRepository<R extends Repository<any>>(repo: Class<R>): Promise<R>;
    dataSource<D extends juggler.DataSource>(dataSource: Class<D> | D, name?: string): Binding<D>;
    model<M extends Class<unknown>>(modelClass: M): Binding<M>;
    component(component: Class<unknown>, name?: string): Binding;
    mountComponentRepositories(component: Class<unknown>): void;
    migrateSchema(options?: SchemaMigrationOptions): Promise<void>;
}
/**
 * A dummy class created to generate the tsdoc for the members in repository
 * mixin. Please don't use it.
 *
 * The members are implemented in function
 * <a href="#RepositoryMixin">RepositoryMixin</a>
 */
export declare class RepositoryMixinDoc {
    constructor(...args: any[]);
    /**
     * Add a repository to this application.
     *
     * @param repo - The repository to add.
     *
     * @example
     * ```ts
     *
     * class NoteRepo {
     *   model: any;
     *
     *   constructor() {
     *     const ds: juggler.DataSource = new juggler.DataSource({
     *       name: 'db',
     *       connector: 'memory',
     *     });
     *
     *     this.model = ds.createModel(
     *       'note',
     *       {title: 'string', content: 'string'},
     *       {}
     *     );
     *   }
     * };
     *
     * app.repository(NoteRepo);
     * ```
     */
    repository(repo: Class<Repository<any>>): Binding;
    /**
     * Retrieve the repository instance from the given Repository class
     *
     * @param repo - The repository class to retrieve the instance of
     */
    getRepository<R extends Repository<any>>(repo: Class<R>): Promise<R>;
    /**
     * Add the dataSource to this application.
     *
     * @param dataSource - The dataSource to add.
     * @param name - The binding name of the datasource; defaults to dataSource.name
     *
     * @example
     * ```ts
     *
     * const ds: juggler.DataSource = new juggler.DataSource({
     *   name: 'db',
     *   connector: 'memory',
     * });
     *
     * app.dataSource(ds);
     *
     * // The datasource can be injected with
     * constructor(@inject('datasources.db') dataSource: DataSourceType) {
     *
     * }
     * ```
     */
    dataSource(dataSource: Class<juggler.DataSource> | juggler.DataSource, name?: string): Binding;
    /**
     * Add a component to this application. Also mounts
     * all the components repositories.
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
    component(component: Class<{}>): Binding;
    /**
     * Get an instance of a component and mount all it's
     * repositories. This function is intended to be used internally
     * by component()
     *
     * @param component - The component to mount repositories of
     */
    mountComponentRepository(component: Class<{}>): void;
    /**
     * Update or recreate the database schema for all repositories.
     *
     * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
     * while updating the schema in your target database, but this is not
     * guaranteed to be safe.
     *
     * Please check the documentation for your specific connector(s) for
     * a detailed breakdown of behaviors for automigrate!
     *
     * @param options - Migration options, e.g. whether to update tables
     * preserving data or rebuild everything from scratch.
     */
    migrateSchema(options?: SchemaMigrationOptions): Promise<void>;
}
/**
 * Create a binding for the given model class
 * @param modelClass - Model class
 */
export declare function createModelClassBinding<M extends Class<unknown>>(modelClass: M): Binding<M>;
