/// <reference types="express" />
import { Getter, Provider, Setter } from '@loopback/core';
import { Middleware, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticateFn, AuthenticationOptions, AuthenticationStrategy } from '../types';
/**
 * Provides the authentication action for a sequence
 * @example
 * ```ts
 * context.bind('authentication.actions.authenticate').toProvider(AuthenticateActionProvider)
 * ```
 */
export declare class AuthenticateActionProvider implements Provider<AuthenticateFn> {
    readonly getStrategies: Getter<AuthenticationStrategy | AuthenticationStrategy[] | undefined>;
    readonly setCurrentUser: Setter<UserProfile>;
    readonly setRedirectUrl: Setter<string>;
    readonly setRedirectStatus: Setter<number>;
    private readonly options;
    constructor(getStrategies: Getter<AuthenticationStrategy | AuthenticationStrategy[] | undefined>, setCurrentUser: Setter<UserProfile>, setRedirectUrl: Setter<string>, setRedirectStatus: Setter<number>, options?: AuthenticationOptions);
    /**
     * @returns authenticateFn
     */
    value(): AuthenticateFn;
    /**
     * The implementation of authenticate() sequence action.
     * @param request - The incoming request provided by the REST layer
     */
    action(request: Request): Promise<UserProfile | undefined>;
}
export declare class AuthenticationMiddlewareProvider implements Provider<Middleware> {
    private authenticate;
    constructor(authenticate: AuthenticateFn);
    value(): Middleware;
}
