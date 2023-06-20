/// <reference types="node" />
import { Binding, BindingFromClassOptions, Constructor, Context, DynamicValueProviderClass, Interceptor, InterceptorBindingOptions, JSONObject, Provider, ValueOrPromise } from '@loopback/context';
import { Component } from './component';
import { LifeCycleObserver } from './lifecycle';
import { Server } from './server';
import { ServiceOptions } from './service';
/**
 * Application is the container for various types of artifacts, such as
 * components, servers, controllers, repositories, datasources, connectors,
 * and models.
 */
export declare class Application extends Context implements LifeCycleObserver {
    readonly options: ApplicationConfig;
    /**
     * A flag to indicate that the application is being shut down
     */
    private _isShuttingDown;
    private _shutdownOptions;
    private _signalListener;
    private _initialized;
    /**
     * State of the application
     */
    private _state;
    /**
     * Get the state of the application. The initial state is `created` and it can
     * transition as follows by `start` and `stop`:
     *
     * 1. start
     *   - !started -> starting -> started
     *   - started -> started (no-op)
     * 2. stop
     *   - (started | initialized) -> stopping -> stopped
     *   - ! (started || initialized) -> stopped (no-op)
     *
     * Two types of states are expected:
     * - stable, such as `started` and `stopped`
     * - in process, such as `booting` and `starting`
     *
     * Operations such as `start` and `stop` can only be called at a stable state.
     * The logic should immediately set the state to a new one indicating work in
     * process, such as `starting` and `stopping`.
     */
    get state(): string;
    /**
     * Create an application with the given parent context
     * @param parent - Parent context
     */
    constructor(parent: Context);
    /**
     * Create an application with the given configuration and parent context
     * @param config - Application configuration
     * @param parent - Parent context
     */
    constructor(config?: ApplicationConfig, parent?: Context);
    /**
     * Register a controller class with this application.
     *
     * @param controllerCtor - The controller class
     * (constructor function).
     * @param name - Optional controller name, default to the class name
     * @returns The newly created binding, you can use the reference to
     * further modify the binding, e.g. lock the value to prevent further
     * modifications.
     *
     * @example
     * ```ts
     * class MyController {
     * }
     * app.controller(MyController).lock();
     * ```
     */
    controller<T>(controllerCtor: ControllerClass<T>, nameOrOptions?: string | BindingFromClassOptions): Binding<T>;
    /**
     * Bind a Server constructor to the Application's master context.
     * Each server constructor added in this way must provide a unique prefix
     * to prevent binding overlap.
     *
     * @example
     * ```ts
     * app.server(RestServer);
     * // This server constructor will be bound under "servers.RestServer".
     * app.server(RestServer, "v1API");
     * // This server instance will be bound under "servers.v1API".
     * ```
     *
     * @param server - The server constructor.
     * @param nameOrOptions - Optional override for name or options.
     * @returns Binding for the server class
     *
     */
    server<T extends Server>(ctor: Constructor<T>, nameOrOptions?: string | BindingFromClassOptions): Binding<T>;
    /**
     * Bind an array of Server constructors to the Application's master
     * context.
     * Each server added in this way will automatically be named based on the
     * class constructor name with the "servers." prefix.
     *
     * @remarks
     * If you wish to control the binding keys for particular server instances,
     * use the app.server function instead.
     * ```ts
     * app.servers([
     *  RestServer,
     *  GRPCServer,
     * ]);
     * // Creates a binding for "servers.RestServer" and a binding for
     * // "servers.GRPCServer";
     * ```
     *
     * @param ctors - An array of Server constructors.
     * @returns An array of bindings for the registered server classes
     *
     */
    servers<T extends Server>(ctors: Constructor<T>[]): Binding[];
    /**
     * Retrieve the singleton instance for a bound server.
     *
     * @typeParam T - Server type
     * @param ctor - The constructor that was used to make the
     * binding.
     * @returns A Promise of server instance
     *
     */
    getServer<T extends Server>(target: Constructor<T> | string): Promise<T>;
    /**
     * Assert there is no other operation is in progress, i.e., the state is not
     * `*ing`, such as `starting` or `stopping`.
     *
     * @param op - The operation name, such as 'boot', 'start', or 'stop'
     */
    protected assertNotInProcess(op: string): void;
    /**
     * Assert current state of the application to be one of the expected values
     * @param op - The operation name, such as 'boot', 'start', or 'stop'
     * @param states - Valid states
     */
    protected assertInStates(op: string, ...states: string[]): void;
    /**
     * Transition the application to a new state and emit an event
     * @param state - The new state
     */
    protected setState(state: string): void;
    protected awaitState(state: string): Promise<void>;
    /**
     * Initialize the application, and all of its registered observers. The
     * application state is checked to ensure the integrity of `initialize`.
     *
     * If the application is already initialized, no operation is performed.
     *
     * This method is automatically invoked by `start()` if the application is not
     * initialized.
     */
    init(): Promise<void>;
    /**
     * Register a function to be called when the application initializes.
     *
     * This is a shortcut for adding a binding for a LifeCycleObserver
     * implementing a `init()` method.
     *
     * @param fn The function to invoke, it can be synchronous (returning `void`)
     * or asynchronous (returning `Promise<void>`).
     * @returns The LifeCycleObserver binding created.
     */
    onInit(fn: () => ValueOrPromise<void>): Binding<LifeCycleObserver>;
    /**
     * Start the application, and all of its registered observers. The application
     * state is checked to ensure the integrity of `start`.
     *
     * If the application is not initialized, it calls first `init()` to
     * initialize the application. This only happens if `start()` is called for
     * the first time.
     *
     * If the application is already started, no operation is performed.
     */
    start(): Promise<void>;
    /**
     * Register a function to be called when the application starts.
     *
     * This is a shortcut for adding a binding for a LifeCycleObserver
     * implementing a `start()` method.
     *
     * @param fn The function to invoke, it can be synchronous (returning `void`)
     * or asynchronous (returning `Promise<void>`).
     * @returns The LifeCycleObserver binding created.
     */
    onStart(fn: () => ValueOrPromise<void>): Binding<LifeCycleObserver>;
    /**
     * Stop the application instance and all of its registered observers. The
     * application state is checked to ensure the integrity of `stop`.
     *
     * If the application is already stopped or not started, no operation is
     * performed.
     */
    stop(): Promise<void>;
    /**
     * Register a function to be called when the application starts.
     *
     * This is a shortcut for adding a binding for a LifeCycleObserver
     * implementing a `start()` method.
     *
     * @param fn The function to invoke, it can be synchronous (returning `void`)
     * or asynchronous (returning `Promise<void>`).
     * @returns The LifeCycleObserver binding created.
     */
    onStop(fn: () => ValueOrPromise<void>): Binding<LifeCycleObserver>;
    private getLifeCycleObserverRegistry;
    /**
     * Add a component to this application and register extensions such as
     * controllers, providers, and servers from the component.
     *
     * @param componentCtor - The component class to add.
     * @param nameOrOptions - Optional component name or options, default to the
     * class name
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
    component<T extends Component = Component>(componentCtor: Constructor<T>, nameOrOptions?: string | BindingFromClassOptions): Binding<T>;
    /**
     * Set application metadata. `@loopback/boot` calls this method to populate
     * the metadata from `package.json`.
     *
     * @param metadata - Application metadata
     */
    setMetadata(metadata: ApplicationMetadata): void;
    /**
     * Register a life cycle observer class
     * @param ctor - A class implements LifeCycleObserver
     * @param nameOrOptions - Optional name or options for the life cycle observer
     */
    lifeCycleObserver<T extends LifeCycleObserver>(ctor: Constructor<T>, nameOrOptions?: string | BindingFromClassOptions): Binding<T>;
    /**
     * Add a service to this application.
     *
     * @param cls - The service or provider class
     *
     * @example
     *
     * ```ts
     * // Define a class to be bound via ctx.toClass()
     * @injectable({scope: BindingScope.SINGLETON})
     * export class LogService {
     *   log(msg: string) {
     *     console.log(msg);
     *   }
     * }
     *
     * // Define a class to be bound via ctx.toProvider()
     * import {v4 as uuidv4} from 'uuid';
     * export class UuidProvider implements Provider<string> {
     *   value() {
     *     return uuidv4();
     *   }
     * }
     *
     * // Register the local services
     * app.service(LogService);
     * app.service(UuidProvider, 'uuid');
     *
     * export class MyController {
     *   constructor(
     *     @inject('services.uuid') private uuid: string,
     *     @inject('services.LogService') private log: LogService,
     *   ) {
     *   }
     *
     *   greet(name: string) {
     *     this.log(`Greet request ${this.uuid} received: ${name}`);
     *     return `${this.uuid}: ${name}`;
     *   }
     * }
     * ```
     */
    service<S>(cls: ServiceOrProviderClass<S>, nameOrOptions?: string | ServiceOptions): Binding<S>;
    /**
     * Register an interceptor
     * @param interceptor - An interceptor function or provider class
     * @param nameOrOptions - Binding name or options
     */
    interceptor(interceptor: Interceptor | Constructor<Provider<Interceptor>>, nameOrOptions?: string | InterceptorBindingOptions): Binding<Interceptor>;
    /**
     * Set up signals that are captured to shutdown the application
     */
    protected setupShutdown(): (signal: string) => Promise<void>;
    private registerSignalListener;
    private removeSignalListener;
}
/**
 * Options to set up application shutdown
 */
export type ShutdownOptions = {
    /**
     * An array of signals to be trapped for graceful shutdown
     */
    signals?: NodeJS.Signals[];
    /**
     * Period in milliseconds to wait for the grace shutdown to finish before
     * exiting the process
     */
    gracePeriod?: number;
};
/**
 * Configuration for application
 */
export interface ApplicationConfig {
    /**
     * Name of the application context
     */
    name?: string;
    /**
     * Configuration for signals that shut down the application
     */
    shutdown?: ShutdownOptions;
    /**
     * Other properties
     */
    [prop: string]: any;
}
export type ControllerClass<T = any> = Constructor<T>;
export type ServiceOrProviderClass<T = any> = Constructor<T | Provider<T>> | DynamicValueProviderClass<T>;
/**
 * Type description for `package.json`
 */
export interface ApplicationMetadata extends JSONObject {
    name: string;
    version: string;
    description: string;
}
