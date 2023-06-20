"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHENTICATION_METADATA_CLASS_KEY = exports.AUTHENTICATION_METADATA_KEY = exports.AUTHENTICATION_METADATA_METHOD_KEY = exports.AuthenticationBindings = void 0;
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
/**
 * Binding keys used by this component.
 */
var AuthenticationBindings;
(function (AuthenticationBindings) {
    AuthenticationBindings.COMPONENT = core_1.BindingKey.create('components.AuthenticationComponent');
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    AuthenticationBindings.USER_PROFILE_FACTORY = core_1.BindingKey.create('authentication.userProfileFactory');
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
    AuthenticationBindings.STRATEGY = core_1.BindingKey.create('authentication.strategy');
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
    AuthenticationBindings.AUTH_ACTION = core_1.BindingKey.create('authentication.actions.authenticate');
    /**
     * Binding key for AUTHENTICATION_MIDDLEWARE
     */
    AuthenticationBindings.AUTHENTICATION_MIDDLEWARE = core_1.BindingKey.create('middleware.authentication');
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
    AuthenticationBindings.METADATA = core_1.BindingKey.create('authentication.operationMetadata');
    AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME = 'authentication.strategies';
    // Make `CURRENT_USER` the alias of SecurityBindings.USER for backward compatibility
    AuthenticationBindings.CURRENT_USER = security_1.SecurityBindings.USER;
    // Redirect url for authenticating current user
    AuthenticationBindings.AUTHENTICATION_REDIRECT_URL = core_1.BindingKey.create('authentication.redirect.url');
    // Authentication redirect status, usually 302 or 303, indicates a web client will redirect
    AuthenticationBindings.AUTHENTICATION_REDIRECT_STATUS = core_1.BindingKey.create('authentication.redirect.status');
})(AuthenticationBindings = exports.AuthenticationBindings || (exports.AuthenticationBindings = {}));
/**
 * The key used to store method-level metadata for `@authenticate`
 */
exports.AUTHENTICATION_METADATA_METHOD_KEY = core_1.MetadataAccessor.create('authentication:method');
/**
 * Alias for AUTHENTICATION_METADATA_METHOD_KEY to keep it backward compatible
 */
exports.AUTHENTICATION_METADATA_KEY = exports.AUTHENTICATION_METADATA_METHOD_KEY;
/**
 * The key used to store class-level metadata for `@authenticate`
 */
exports.AUTHENTICATION_METADATA_CLASS_KEY = core_1.MetadataAccessor.create('authentication:class');
//# sourceMappingURL=keys.js.map