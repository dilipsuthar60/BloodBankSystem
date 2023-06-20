"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camp = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Camp = class Camp extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Camp.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "location", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'object',
        required: false,
    }),
    tslib_1.__metadata("design:type", Array)
], Camp.prototype, "donors", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Camp.prototype, "endTime", void 0);
Camp = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Camp);
exports.Camp = Camp;
//# sourceMappingURL=camp.model.js.map