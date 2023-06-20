"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentialsRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const keys_1 = require("../keys");
const models_1 = require("../models");
let UserCredentialsRepository = class UserCredentialsRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.UserCredentials, dataSource);
    }
};
UserCredentialsRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(`datasources.${keys_1.UserServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], UserCredentialsRepository);
exports.UserCredentialsRepository = UserCredentialsRepository;
//# sourceMappingURL=user-credentials.repository.js.map