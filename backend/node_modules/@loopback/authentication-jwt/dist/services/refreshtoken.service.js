"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshtokenService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const util_1 = require("util");
const keys_1 = require("../keys");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const user_service_1 = require("./user.service");
const jwt = require('jsonwebtoken');
const signAsync = (0, util_1.promisify)(jwt.sign);
const verifyAsync = (0, util_1.promisify)(jwt.verify);
let RefreshtokenService = class RefreshtokenService {
    constructor(refreshSecret, refreshExpiresIn, refreshIssure, refreshTokenRepository, userService, jwtService) {
        this.refreshSecret = refreshSecret;
        this.refreshExpiresIn = refreshExpiresIn;
        this.refreshIssure = refreshIssure;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    /**
     * Generate a refresh token, bind it with the given user profile + access
     * token, then store them in backend.
     */
    async generateToken(userProfile, token) {
        const data = {
            token: (0, core_1.uuid)(),
        };
        const refreshToken = await signAsync(data, this.refreshSecret, {
            expiresIn: Number(this.refreshExpiresIn),
            issuer: this.refreshIssure,
        });
        const result = {
            accessToken: token,
            refreshToken: refreshToken,
        };
        await this.refreshTokenRepository.create({
            userId: userProfile[security_1.securityId],
            refreshToken: result.refreshToken,
        });
        return result;
    }
    /*
     * Refresh the access token bound with the given refresh token.
     */
    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : 'refresh token' is null`);
            }
            const userRefreshData = await this.verifyToken(refreshToken);
            const user = await this.userService.findUserById(userRefreshData.userId.toString());
            const userProfile = this.userService.convertToUserProfile(user);
            // create a JSON Web Token based on the user profile
            const token = await this.jwtService.generateToken(userProfile);
            return {
                accessToken: token,
            };
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
    }
    /*
     * [TODO] test and endpoint
     */
    async revokeToken(refreshToken) {
        try {
            await this.refreshTokenRepository.delete(new models_1.RefreshToken({ refreshToken: refreshToken }));
        }
        catch (e) {
            // ignore
        }
    }
    /**
     * Verify the validity of a refresh token, and make sure it exists in backend.
     * @param refreshToken
     */
    async verifyToken(refreshToken) {
        try {
            await verifyAsync(refreshToken, this.refreshSecret);
            const userRefreshData = await this.refreshTokenRepository.findOne({
                where: { refreshToken: refreshToken },
            });
            if (!userRefreshData) {
                throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : Invalid Token`);
            }
            return userRefreshData;
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
    }
};
RefreshtokenService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RefreshTokenServiceBindings.REFRESH_SECRET)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.RefreshTokenServiceBindings.REFRESH_EXPIRES_IN)),
    tslib_1.__param(2, (0, core_1.inject)(keys_1.RefreshTokenServiceBindings.REFRESH_ISSUER)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.RefreshTokenRepository)),
    tslib_1.__param(4, (0, core_1.inject)(keys_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(5, (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [String, String, String, repositories_1.RefreshTokenRepository,
        user_service_1.MyUserService, Object])
], RefreshtokenService);
exports.RefreshtokenService = RefreshtokenService;
//# sourceMappingURL=refreshtoken.service.js.map