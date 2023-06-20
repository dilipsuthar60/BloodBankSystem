"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodbankDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'bloodbank',
    connector: 'mysql',
    url: '',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bloodbank'
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let BloodbankDataSource = class BloodbankDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
BloodbankDataSource.dataSourceName = 'bloodbank';
BloodbankDataSource.defaultConfig = config;
BloodbankDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.bloodbank', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], BloodbankDataSource);
exports.BloodbankDataSource = BloodbankDataSource;
//# sourceMappingURL=bloodbank.datasource.js.map