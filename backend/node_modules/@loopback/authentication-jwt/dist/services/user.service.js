"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyUserService = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const bcryptjs_1 = require("bcryptjs");
const repositories_1 = require("../repositories");
let MyUserService = class MyUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async verifyCredentials(credentials) {
        const invalidCredentialsError = 'Invalid email or password.';
        const foundUser = await this.userRepository.findOne({
            where: { email: credentials.email },
        });
        if (!foundUser) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        const credentialsFound = await this.userRepository.findCredentials(foundUser.id);
        if (!credentialsFound) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        const passwordMatched = await (0, bcryptjs_1.compare)(credentials.password, credentialsFound.password);
        if (!passwordMatched) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        return foundUser;
    }
    convertToUserProfile(user) {
        return {
            [security_1.securityId]: user.id.toString(),
            name: user.username,
            id: user.id,
            email: user.email,
        };
    }
    //function to find user by id
    async findUserById(id) {
        const userNotfound = 'invalid User';
        const foundUser = await this.userRepository.findOne({
            where: { id: id },
        });
        if (!foundUser) {
            throw new rest_1.HttpErrors.Unauthorized(userNotfound);
        }
        return foundUser;
    }
};
MyUserService = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository])
], MyUserService);
exports.MyUserService = MyUserService;
//# sourceMappingURL=user.service.js.map