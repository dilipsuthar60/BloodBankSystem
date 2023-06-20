"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const util_1 = require("util");
const keys_1 = require("../keys");
const jwt = require('jsonwebtoken');
const signAsync = (0, util_1.promisify)(jwt.sign);
const verifyAsync = (0, util_1.promisify)(jwt.verify);
let JWTService = class JWTService {
    constructor(jwtSecret, jwtExpiresIn) {
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    async verifyToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : 'token' is null`);
        }
        let userProfile;
        try {
            // decode user profile from token
            const decodedToken = await verifyAsync(token, this.jwtSecret);
            // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
            userProfile = Object.assign({ [security_1.securityId]: '', name: '' }, {
                [security_1.securityId]: decodedToken.id,
                name: decodedToken.name,
                id: decodedToken.id,
            });
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
        return userProfile;
    }
    async generateToken(userProfile) {
        if (!userProfile) {
            throw new rest_1.HttpErrors.Unauthorized('Error generating token : userProfile is null');
        }
        const userInfoForToken = {
            id: userProfile[security_1.securityId],
            name: userProfile.name,
            email: userProfile.email,
        };
        // Generate a JSON Web Token
        let token;
        try {
            token = await signAsync(userInfoForToken, this.jwtSecret, {
                expiresIn: Number(this.jwtExpiresIn),
            });
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error encoding token : ${error}`);
        }
        return token;
    }
};
JWTService = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SECRET)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_EXPIRES_IN)),
    tslib_1.__metadata("design:paramtypes", [String, String])
], JWTService);
exports.JWTService = JWTService;
//# sourceMappingURL=jwt.service.js.map