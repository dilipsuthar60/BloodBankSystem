"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenServiceBindings = exports.RefreshTokenConstants = exports.UserServiceBindings = exports.TokenServiceBindings = exports.TokenServiceConstants = void 0;
const core_1 = require("@loopback/core");
var TokenServiceConstants;
(function (TokenServiceConstants) {
    TokenServiceConstants.TOKEN_SECRET_VALUE = 'myjwts3cr3t';
    TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE = '21600';
})(TokenServiceConstants = exports.TokenServiceConstants || (exports.TokenServiceConstants = {}));
var TokenServiceBindings;
(function (TokenServiceBindings) {
    TokenServiceBindings.TOKEN_SECRET = core_1.BindingKey.create('authentication.jwt.secret');
    TokenServiceBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expires.in.seconds');
    TokenServiceBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.tokenservice');
})(TokenServiceBindings = exports.TokenServiceBindings || (exports.TokenServiceBindings = {}));
var UserServiceBindings;
(function (UserServiceBindings) {
    UserServiceBindings.USER_SERVICE = core_1.BindingKey.create('services.user.service');
    UserServiceBindings.DATASOURCE_NAME = 'jwtdb';
    UserServiceBindings.USER_REPOSITORY = 'repositories.UserRepository';
    UserServiceBindings.USER_CREDENTIALS_REPOSITORY = 'repositories.UserCredentialsRepository';
})(UserServiceBindings = exports.UserServiceBindings || (exports.UserServiceBindings = {}));
/**
 * Constant values used when generating refresh token.
 */
var RefreshTokenConstants;
(function (RefreshTokenConstants) {
    /**
     * The default secret used when generating refresh token.
     */
    RefreshTokenConstants.REFRESH_SECRET_VALUE = 'r3fr35htok3n';
    /**
     * The default expiration time for refresh token.
     */
    RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE = '216000';
    /**
     * The default issuer used when generating refresh token.
     */
    RefreshTokenConstants.REFRESH_ISSUER_VALUE = 'loopback4';
})(RefreshTokenConstants = exports.RefreshTokenConstants || (exports.RefreshTokenConstants = {}));
/**
 * Bindings related to token refresh service. The omitted explanation can be
 * found in namespace `RefreshTokenConstants`.
 */
var RefreshTokenServiceBindings;
(function (RefreshTokenServiceBindings) {
    RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.refresh.tokenservice');
    RefreshTokenServiceBindings.REFRESH_SECRET = core_1.BindingKey.create('authentication.jwt.refresh.secret');
    RefreshTokenServiceBindings.REFRESH_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.refresh.expires.in.seconds');
    RefreshTokenServiceBindings.REFRESH_ISSUER = core_1.BindingKey.create('authentication.jwt.refresh.issuer');
    /**
     * The backend datasource for refresh token's persistency.
     */
    RefreshTokenServiceBindings.DATASOURCE_NAME = 'refreshdb';
    /**
     * Key for the repository that stores the refresh token and its bound user
     * information
     */
    RefreshTokenServiceBindings.REFRESH_REPOSITORY = 'repositories.RefreshTokenRepository';
})(RefreshTokenServiceBindings = exports.RefreshTokenServiceBindings || (exports.RefreshTokenServiceBindings = {}));
//# sourceMappingURL=keys.js.map