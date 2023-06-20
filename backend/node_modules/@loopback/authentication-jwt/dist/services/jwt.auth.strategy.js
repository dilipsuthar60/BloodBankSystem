"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthenticationStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../keys");
let JWTAuthenticationStrategy = class JWTAuthenticationStrategy {
    constructor(tokenService) {
        this.tokenService = tokenService;
        this.name = 'jwt';
    }
    async authenticate(request) {
        const token = this.extractCredentials(request);
        const userProfile = await this.tokenService.verifyToken(token);
        return userProfile;
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header not found.`);
        }
        // for example : Bearer xxx.yyy.zzz
        const authHeaderValue = request.headers.authorization;
        if (!authHeaderValue.startsWith('Bearer')) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header is not of type 'Bearer'.`);
        }
        //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2)
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`);
        const token = parts[1];
        return token;
    }
};
JWTAuthenticationStrategy = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object])
], JWTAuthenticationStrategy);
exports.JWTAuthenticationStrategy = JWTAuthenticationStrategy;
//# sourceMappingURL=jwt.auth.strategy.js.map