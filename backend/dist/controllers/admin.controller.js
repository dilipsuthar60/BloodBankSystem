"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
let AdminController = class AdminController {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async create(admin) {
        // Encrypt the password
        const hashedPassword = (0, bcrypt_1.hashSync)(admin.password, 10);
        admin.password = hashedPassword;
        return this.adminRepository.create(admin);
    }
    async count(where) {
        return this.adminRepository.count(where);
    }
    async find(filter) {
        return this.adminRepository.find(filter);
    }
    async updateAll(admin, where) {
        return this.adminRepository.updateAll(admin, where);
    }
    async findById(id, filter) {
        return this.adminRepository.findById(id, filter);
    }
    async updateById(id, admin) {
        await this.adminRepository.updateById(id, admin);
    }
    async replaceById(id, admin) {
        await this.adminRepository.replaceById(id, admin);
    }
    async deleteById(id) {
        await this.adminRepository.deleteById(id);
    }
    async login(credentials) {
        const { email, password } = credentials;
        // Find the admin based on the email
        const admin = await this.adminRepository.findOne({
            where: { email },
            fields: { id: true, password: true },
        });
        if (!admin) {
            throw new rest_1.HttpErrors.NotFound('Admin not found.');
        }
        if (!(0, bcrypt_1.compareSync)(password, admin.password)) {
            throw new rest_1.HttpErrors.Unauthorized('Incorrect password.');
        }
        // Generate a JWT token
        const token = (0, jsonwebtoken_1.sign)({ adminId: admin.id }, 'your_secret_key', {
            expiresIn: '1h',
        });
        return { token };
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/admins'),
    (0, rest_1.response)(200, {
        description: 'Admin model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Admin) } },
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
    tslib_1.__metadata("design:paramtypes", [models_1.Admin]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/admins/count'),
    (0, rest_1.response)(200, {
        description: 'Admin model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Admin)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/admins'),
    (0, rest_1.response)(200, {
        description: 'Array of Admin model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Admin, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Admin)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/admins'),
    (0, rest_1.response)(200, {
        description: 'Admin PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Admin, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Admin)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Admin, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.get)('/admins/{id}'),
    (0, rest_1.response)(200, {
        description: 'Admin model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Admin, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Admin, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/admins/{id}'),
    (0, rest_1.response)(204, {
        description: 'Admin PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Admin, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Admin]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/admins/{id}'),
    (0, rest_1.response)(204, {
        description: 'Admin PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Admin]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/admins/{id}'),
    (0, rest_1.response)(204, {
        description: 'Admin DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminController.prototype, "deleteById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/admin/login'),
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
], AdminController.prototype, "login", null);
AdminController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AdminRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AdminRepository])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map