"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddlewareProvider = exports.AuthenticateActionProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const keys_1 = require("../keys");
const types_1 = require("../types");
/**
 * Provides the authentication action for a sequence
 * @example
 * ```ts
 * context.bind('authentication.actions.authenticate').toProvider(AuthenticateActionProvider)
 * ```
 */
let AuthenticateActionProvider = class AuthenticateActionProvider {
    constructor(
    // The provider is instantiated for Sequence constructor,
    // at which time we don't have information about the current
    // route yet. This information is needed to determine
    // what auth strategy should be used.
    // To solve this, we are injecting a getter function that will
    // defer resolution of the strategy until authenticate() action
    // is executed.
    getStrategies, setCurrentUser, setRedirectUrl, setRedirectStatus, options = {}) {
        this.getStrategies = getStrategies;
        this.setCurrentUser = setCurrentUser;
        this.setRedirectUrl = setRedirectUrl;
        this.setRedirectStatus = setRedirectStatus;
        this.options = options;
    }
    /**
     * @returns authenticateFn
     */
    value() {
        return request => this.action(request);
    }
    /**
     * The implementation of authenticate() sequence action.
     * @param request - The incoming request provided by the REST layer
     */
    async action(request) {
        let strategies = await this.getStrategies();
        if (strategies == null) {
            // The invoked operation does not require authentication.
            return undefined;
        }
        // convert to array if required
        strategies = Array.isArray(strategies) ? strategies : [strategies];
        const authErrors = [];
        for (const strategy of strategies) {
            let authResponse = undefined;
            try {
                authResponse = await strategy.authenticate(request);
            }
            catch (err) {
                if (this.options.failOnError) {
                    throw err;
                }
                authErrors.push(err);
            }
            // response from `strategy.authenticate()` could return an object of
            // type UserProfile or RedirectRoute
            if (rest_1.RedirectRoute.isRedirectRoute(authResponse)) {
                const redirectOptions = authResponse;
                // bind redirection url and status to the context
                // controller should handle actual redirection
                this.setRedirectUrl(redirectOptions.targetLocation);
                this.setRedirectStatus(redirectOptions.statusCode);
                return;
            }
            else if (authResponse != null) {
                // if `strategy.authenticate()` returns an object of type UserProfile,
                // set it as current user
                const userProfile = authResponse;
                this.setCurrentUser(userProfile);
                return userProfile;
            }
        }
        if (authErrors.length) {
            throw authErrors[0];
        }
        // important to throw a non-protocol-specific error here
        const error = new Error(`User profile not returned from strategy's authenticate function`);
        Object.assign(error, {
            code: types_1.USER_PROFILE_NOT_FOUND,
        });
        throw error;
    }
};
AuthenticateActionProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject.getter(keys_1.AuthenticationBindings.STRATEGY)),
    tslib_1.__param(1, core_1.inject.setter(security_1.SecurityBindings.USER)),
    tslib_1.__param(2, core_1.inject.setter(keys_1.AuthenticationBindings.AUTHENTICATION_REDIRECT_URL)),
    tslib_1.__param(3, core_1.inject.setter(keys_1.AuthenticationBindings.AUTHENTICATION_REDIRECT_STATUS)),
    tslib_1.__param(4, (0, core_1.config)({ fromBinding: keys_1.AuthenticationBindings.COMPONENT })),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Object])
], AuthenticateActionProvider);
exports.AuthenticateActionProvider = AuthenticateActionProvider;
let AuthenticationMiddlewareProvider = class AuthenticationMiddlewareProvider {
    constructor(authenticate) {
        this.authenticate = authenticate;
    }
    value() {
        return async (ctx, next) => {
            try {
                await this.authenticate(ctx.request);
            }
            catch (error) {
                if (error.code === types_1.AUTHENTICATION_STRATEGY_NOT_FOUND ||
                    error.code === types_1.USER_PROFILE_NOT_FOUND) {
                    error.statusCode = 401;
                }
                throw error;
            }
            return next();
        };
    }
};
AuthenticationMiddlewareProvider = tslib_1.__decorate([
    (0, core_1.injectable)((0, rest_1.asMiddleware)({
        group: rest_1.RestMiddlewareGroups.AUTHENTICATION,
        upstreamGroups: [rest_1.RestMiddlewareGroups.FIND_ROUTE],
    })),
    tslib_1.__param(0, (0, core_1.inject)(keys_1.AuthenticationBindings.AUTH_ACTION)),
    tslib_1.__metadata("design:paramtypes", [Function])
], AuthenticationMiddlewareProvider);
exports.AuthenticationMiddlewareProvider = AuthenticationMiddlewareProvider;
//# sourceMappingURL=auth-action.provider.js.map