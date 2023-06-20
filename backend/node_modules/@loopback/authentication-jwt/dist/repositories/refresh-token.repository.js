"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const keys_1 = require("../keys");
let RefreshTokenRepository = class RefreshTokenRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.RefreshToken, dataSource);
    }
};
RefreshTokenRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(`datasources.${keys_1.RefreshTokenServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], RefreshTokenRepository);
exports.RefreshTokenRepository = RefreshTokenRepository;
//# sourceMappingURL=refresh-token.repository.js.map