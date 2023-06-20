"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
let DonorController = class DonorController {
    constructor(donorRepository) {
        this.donorRepository = donorRepository;
    }
    async create(donor) {
        // Encrypt the password
        const hashedPassword = (0, bcrypt_1.hashSync)(donor.password, 10);
        donor.password = hashedPassword;
        return this.donorRepository.create(donor);
    }
    async count(where) {
        return this.donorRepository.count(where);
    }
    async find(filter) {
        return this.donorRepository.find(filter);
    }
    async updateAll(donor, where) {
        return this.donorRepository.updateAll(donor, where);
    }
    async findById(id, filter) {
        const donor = await this.donorRepository.findById(id, filter);
        if (!donor) {
            throw new rest_1.HttpErrors.NotFound('Donor not found.');
        }
        return donor;
    }
    async updateById(id, donor) {
        await this.donorRepository.updateById(id, donor);
    }
    async replaceById(id, donor) {
        const existingDonor = await this.donorRepository.findById(id);
        const updatedDonor = Object.assign(existingDonor, donor);
        await this.donorRepository.replaceById(id, updatedDonor);
    }
    async deleteById(id) {
        await this.donorRepository.deleteById(id);
    }
    async login(credentials) {
        const { email, password } = credentials;
        // Find the donor based on the email
        const donor = await this.donorRepository.findOne({
            where: { email },
            fields: { id: true, password: true },
        });
        if (!donor) {
            throw new rest_1.HttpErrors.NotFound('Donor not found.');
        }
        if (!(0, bcrypt_1.compareSync)(password, donor.password)) {
            throw new rest_1.HttpErrors.Unauthorized('Incorrect password.');
        }
        // generating a JWT token
        const token = (0, jsonwebtoken_1.sign)({ donorId: donor.id }, 'your_secret_key', {
            expiresIn: '1h',
        });
        return { token, id: donor.id };
    }
    async getDonorCamps(id) {
        var _a;
        const donor = await this.donorRepository.findById(id);
        if (!donor) {
            throw new Error('Donor not found');
        }
        const camps = (_a = donor.camps) !== null && _a !== void 0 ? _a : [];
        const campObjects = [];
        for (const campId of camps) {
            const camp = await this.campRepository.findById(campId);
            if (camp) {
                const campObject = {
                    id: camp.id,
                    name: camp.name,
                    date: camp.date,
                    location: camp.location,
                    createdBy: camp.createdBy,
                    startTime: camp.startTime,
                    endTime: camp.endTime,
                };
                campObjects.push(campObject);
            }
        }
        return campObjects;
    }
    async isRegister(request) {
        var _a, _b;
        const donor = await this.donorRepository.findById(request.donorId);
        if (!donor) {
            throw new Error('Donor not found');
        }
        const isRegistered = (_b = (_a = donor.camps) === null || _a === void 0 ? void 0 : _a.includes(request.campId)) !== null && _b !== void 0 ? _b : false;
        return { isRegistered };
    }
};
tslib_1.__decorate([
    (0, repository_1.repository)(repositories_1.CampRepository),
    tslib_1.__metadata("design:type", repositories_1.CampRepository)
], DonorController.prototype, "campRepository", void 0);
tslib_1.__decorate([
    (0, rest_1.post)('/donors'),
    (0, rest_1.response)(200, {
        description: 'Donor model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Donor) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Donor, {
                    title: 'NewDonor',
                    exclude: ['id', 'camps'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/donors/count'),
    (0, rest_1.response)(200, {
        description: 'Donor model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Donor)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/donors'),
    (0, rest_1.response)(200, {
        description: 'Array of Donor model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Donor, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Donor)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/donors'),
    (0, rest_1.response)(200, {
        description: 'Donor PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Donor, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Donor)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Donor, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.get)('/donors/{id}'),
    (0, rest_1.response)(200, {
        description: 'Donor model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Donor, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Donor, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/donors/{id}'),
    (0, rest_1.response)(204, {
        description: 'Donor PATCH success',
        // content: { 'application/json': {schema: {}} }
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Donor, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Donor]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/donors/{id}'),
    (0, rest_1.response)(204, {
        description: 'Donor PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Donor]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/donors/{id}'),
    (0, rest_1.response)(204, {
        description: 'Donor DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "deleteById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/donors/login'),
    (0, rest_1.response)(200, {
        description: 'Login successful',
        content: { 'application/json': { schema: { type: 'string' } } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                    },
                    required: ['email', 'password'],
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.get)('/donors/{id}/camps'),
    (0, rest_1.response)(200, {
        description: 'Array of Camps registered by the Donor',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Camp, { includeRelations: false }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "getDonorCamps", null);
tslib_1.__decorate([
    (0, rest_1.post)('/donors/isRegister'),
    (0, rest_1.response)(200, {
        description: 'Check if the donor is registered for the camp',
        content: { 'application/json': { schema: { type: 'boolean' } } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        donorId: { type: 'number' },
                        campId: { type: 'number' },
                    },
                    required: ['donorId', 'campId'],
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DonorController.prototype, "isRegister", null);
DonorController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.DonorRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.DonorRepository])
], DonorController);
exports.DonorController = DonorController;
//# sourceMappingURL=donor.controller.js.map