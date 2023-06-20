import { BindingKey, MetadataAccessor } from '@loopback/core';
import { Middleware } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticateFn, AuthenticationMetadata, AuthenticationStrategy, UserProfileFactory } from './types';
/**
 * Binding keys used by this component.
 */
export declare namespace AuthenticationBindings {
    const COMPONENT: BindingKey<AuthenticationComponent>;
    /**
     * Key used to bind a user profile factory to the context for any
     * consumer to use when they need to convert a user object
     * into a slimmer user profile object
     *
     * @example
     * ```ts
     * server
     *   .bind(AuthenticationBindings.USER_PROFILE_FACTORY)
     *   .to(myUserProfileFactory);
     * ```
     */
    const USER_PROFILE_FACTORY: BindingKey<UserProfileFactory<any>>;
    /**
     * Key used to bind an authentication strategy or multiple strategies
     * to the context for the authentication function to use.
     *
     * @example
     * ```ts
     * server
     *   .bind(AuthenticationBindings.STRATEGY)
     *   .toProvider(MyAuthenticationStrategy);
     * ```
     */
    const STRATEGY: BindingKey<AuthenticationStrategy | AuthenticationStrategy[] | undefined>;
    /**
     * Key used to inject the authentication function into the sequence.
     *
     * @example
     * ```ts
     * class MySequence implements SequenceHandler {
     *   constructor(
     *     @inject(AuthenticationBindings.AUTH_ACTION)
     *     protected authenticateRequest: AuthenticateFn,
     *     // ... other sequence action injections
     *   ) {}
     *
     *   async handle(context: RequestContext) {
     *     try {
     *       const {request, response} = context;
     *       const route = this.findRoute(request);
     *
     *      // Authenticate
     *       await this.authenticateRequest(request);
     *
     *       // Authentication successful, proceed to invoke controller
     *       const args = await this.parseParams(request, route);
     *       const result = await this.invoke(route, args);
     *       this.send(response, result);
     *     } catch (err) {
     *       this.reject(context, err);
     *     }
     *   }
     * }
     * ```
     */
    const AUTH_ACTION: BindingKey<AuthenticateFn>;
    /**
     * Binding key for AUTHENTICATION_MIDDLEWARE
     */
    const AUTHENTICATION_MIDDLEWARE: BindingKey<Middleware>;
    /**
     * Key used to inject authentication metadata, which is used to determine
     * whether a request requires authentication or not.
     *
     * @example
     * ```ts
     * class MyPassportStrategyProvider implements Provider<Strategy | undefined> {
     *   constructor(
     *     @inject(AuthenticationBindings.METADATA)
     *     private metadata?: AuthenticationMetadata[],
     *   ) {}
     *   value(): ValueOrPromise<Strategy | undefined> {
     *     if (this.metadata?.length) {
     *       // logic to determine which authentication strategy to return
     *     }
     *   }
     * }
     * ```
     */
    const METADATA: BindingKey<AuthenticationMetadata[] | undefined>;
    const AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME = "authentication.strategies";
    const CURRENT_USER: BindingKey<UserProfile>;
    const AUTHENTICATION_REDIRECT_URL: BindingKey<string>;
    const AUTHENTICATION_REDIRECT_STATUS: BindingKey<number>;
}
/**
 * The key used to store method-level metadata for `@authenticate`
 */
export declare const AUTHENTICATION_METADATA_METHOD_KEY: MetadataAccessor<AuthenticationMetadata, MethodDecorator>;
/**
 * Alias for AUTHENTICATION_METADATA_METHOD_KEY to keep it backward compatible
 */
export declare const AUTHENTICATION_METADATA_KEY: MetadataAccessor<AuthenticationMetadata, MethodDecorator>;
/**
 * The key used to store class-level metadata for `@authenticate`
 */
export declare const AUTHENTICATION_METADATA_CLASS_KEY: MetadataAccessor<AuthenticationMetadata, ClassDecorator>;
