"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donor = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Donor = class Donor extends repository_1.Entity {
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
], Donor.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "dob", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "medicalCondition", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "bloodGroup", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "password", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'number',
        required: false,
    }),
    tslib_1.__metadata("design:type", Array)
], Donor.prototype, "camps", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], Donor.prototype, "image", void 0);
Donor = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Donor);
exports.Donor = Donor;
//# sourceMappingURL=donor.model.js.map