"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const mailgen_1 = tslib_1.__importDefault(require("mailgen"));
class DateProvider {
    getCurrentDate() {
        // Get the current date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    getCurrentTime() {
        // Get the current time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
let CampController = class CampController {
    constructor(campRepository, donorRepository) {
        this.campRepository = campRepository;
        this.donorRepository = donorRepository;
    }
    async create(camp) {
        return this.campRepository.create(camp);
    }
    async count(where) {
        return this.campRepository.count(where);
    }
    async find(filter) {
        return this.campRepository.find(filter);
    }
    async updateAll(camp, where) {
        return this.campRepository.updateAll(camp, where);
    }
    async findById(id, filter) {
        return this.campRepository.findById(id, filter);
    }
    async updateById(id, camp) {
        await this.campRepository.updateById(id, camp);
    }
    async replaceById(id, camp) {
        const existingCamp = await this.campRepository.findById(id);
        const updatedCamp = Object.assign(existingCamp, camp);
        await this.campRepository.replaceById(id, updatedCamp);
    }
    async deleteById(id) {
        await this.campRepository.deleteById(id);
    }
    async registerCamp(registrationData) {
        const { campId, donorId } = registrationData;
        // Find the camp by ID
        const camp = await this.campRepository.findById(campId);
        if (!camp) {
            throw new Error('Camp not found');
        }
        // Check if the camp date and time have passed
        const dateProvider = new DateProvider();
        const currentDate = dateProvider.getCurrentDate();
        const currentTime = dateProvider.getCurrentTime();
        // Check if the donor is already registered for the camp
        // const isRegistered = (camp.donors as any[]).some((donor: any) => donor.id === donorId);
        const isRegistered = (camp.donors || []).some((donor) => donor.id === donorId);
        if (isRegistered) {
            throw Object.assign(new Error('Donor already registered for the camp'), {
                statusCode: 422,
            });
        }
        if (camp.date < currentDate || (camp.date === currentDate && camp.endTime < currentTime)) {
            throw Object.assign(new Error('Cannot register for past camps'), {
                statusCode: 422,
            });
        }
        // Find the donor by ID
        const donor = await this.donorRepository.findById(donorId);
        if (!donor) {
            throw new Error('Donor not found');
        }
        const donorWithoutPassword = {
            id: donor.id,
            name: donor.name,
            email: donor.email,
            gender: donor.gender,
            dob: donor.dob,
            medicalCondition: donor.medicalCondition,
            image: donor.image
        };
        // Save the donor information to the camp's donors property
        if (!camp.donors) {
            camp.donors = [];
        }
        // Add the donor if not already registered
        if (!isRegistered) {
            camp.donors.push(donorWithoutPassword);
        }
        // Update the camp with the new donor information
        await this.campRepository.update(camp);
        if (!donor.camps) {
            donor.camps = [];
        }
        donor.camps.push(campId);
        await this.donorRepository.update(donor);
        return camp;
    }
    async unregisterCamp(unregistrationData) {
        const { campId, donorId } = unregistrationData;
        // Find the camp by ID
        const camp = await this.campRepository.findById(campId);
        if (!camp) {
            throw new Error('Camp not found');
        }
        // Check if the camp date and time have passed
        const dateProvider = new DateProvider();
        const currentDate = dateProvider.getCurrentDate();
        const currentTime = dateProvider.getCurrentTime();
        if (camp.date < currentDate || (camp.date === currentDate && camp.endTime < currentTime)) {
            throw Object.assign(new Error('Cannot unregister for past camps'), {
                statusCode: 422,
            });
        }
        // Find the donor by ID
        const donor = await this.donorRepository.findById(donorId);
        if (!donor) {
            throw new Error('Donor not found');
        }
        // Check if the donor is registered for the camp
        const donorIndex = camp.donors.findIndex((donor) => donor.id === donorId);
        if (donorIndex === -1) {
            throw new Error('Donor is not registered for the camp');
        }
        // Remove the donor from the camp's donors property
        camp.donors.splice(donorIndex, 1);
        // Update the camp with the updated donor information
        await this.campRepository.update(camp);
        // Remove the camp ID from the donor's camps property
        if (donor.camps) {
            const campIndex = donor.camps.indexOf(campId);
            if (campIndex !== -1) {
                donor.camps.splice(campIndex, 1);
            }
        }
        // Update the donor with the removed camp ID
        await this.donorRepository.update(donor);
        return camp;
    }
    async getCampDonors(campId) {
        var _a;
        const camp = await this.campRepository.findById(campId, {
            fields: { donors: true },
        });
        if (!camp) {
            throw new Error('Camp not found');
        }
        return (_a = camp.donors) !== null && _a !== void 0 ? _a : [];
    }
    async sendEmailsToDonors(campId) {
        try {
            const camp = await this.campRepository.findById(campId);
            if (!camp) {
                throw new Error('Camp not found');
            }
            const donors = await this.donorRepository.find();
            if (!donors || donors.length === 0) {
                throw new Error('No donors found');
            }
            const em = "mohitgupta.mg2727@gmail.com";
            const passs = "hwclrtwudrcfnfvi";
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: em,
                    pass: passs,
                },
            });
            const generateEmailBody = (camp) => {
                const mailGenerator = new mailgen_1.default({
                    theme: 'default',
                    product: {
                        name: 'Blood Bank 🩸',
                        link: 'http://app.com',
                    },
                });
                const email = {
                    body: {
                        greeting: 'Hello!',
                        intro: `A new camp has been created. \n
            Please register yourself in this camp and save someone's life. \n
            Below are the camp details.
            `,
                        table: {
                            data: [
                                {
                                    key: 'Name:',
                                    value: camp.name,
                                },
                                {
                                    key: 'Date:',
                                    value: camp.date,
                                },
                                {
                                    key: 'Location:',
                                    value: camp.location,
                                },
                                {
                                    key: 'Start Time',
                                    value: camp.startTime
                                },
                                {
                                    key: 'End Time',
                                    value: camp.endTime
                                }
                            ],
                        },
                        outro: 'Thank you for your support!',
                        organiser: camp.createdBy
                    },
                };
                const emailBody = mailGenerator.generate(email);
                return {
                    body: emailBody,
                    text: mailGenerator.generatePlaintext(email),
                };
            };
            const emailBody = generateEmailBody(camp);
            const emailPromises = donors.map((donor) => {
                const mailOptions = {
                    from: em,
                    to: 'jaxikig287@anomgo.com',
                    subject: 'New Camp Created',
                    html: emailBody.body,
                    text: emailBody.text,
                };
                return transporter.sendMail(mailOptions);
            });
            await Promise.all(emailPromises);
            return 'Emails sent successfully to all donors';
        }
        catch (error) {
            console.error('Failed to send emails to donors:', error);
            throw new Error('Failed to send emails to donors');
        }
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/camps'),
    (0, rest_1.response)(200, {
        description: 'Camp model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Camp) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Camp, {
                    title: 'NewCamp',
                    exclude: ['id', 'donors'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/camps/count'),
    (0, rest_1.response)(200, {
        description: 'Camp model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Camp)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/camps'),
    (0, rest_1.response)(200, {
        description: 'Array of Camp model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Camp, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Camp)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/camps'),
    (0, rest_1.response)(200, {
        description: 'Camp PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Camp, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Camp)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Camp, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.get)('/camps/{id}'),
    (0, rest_1.response)(200, {
        description: 'Camp model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Camp, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Camp, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/camps/{id}'),
    (0, rest_1.response)(204, {
        description: 'Camp PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Camp, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Camp]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/camps/{id}'),
    (0, rest_1.response)(204, {
        description: 'Camp PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Camp]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/camps/{id}'),
    (0, rest_1.response)(204, {
        description: 'Camp DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "deleteById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/camps/register'),
    (0, rest_1.response)(200, {
        description: 'Register a camp by a donor',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Camp) } },
    }),
    (0, rest_1.response)(422, {
        description: 'Cannot register for past camps',
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        campId: { type: 'number' },
                        donorId: { type: 'number' },
                    },
                    required: ['campId', 'donorId'],
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "registerCamp", null);
tslib_1.__decorate([
    (0, rest_1.post)('/camps/unregister'),
    (0, rest_1.response)(200, {
        description: 'Unregister a camp by a donor',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Camp) } },
    }),
    (0, rest_1.response)(422, {
        description: 'Cannot unregister for past camps',
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        campId: { type: 'number' },
                        donorId: { type: 'number' },
                    },
                    required: ['campId', 'donorId'],
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "unregisterCamp", null);
tslib_1.__decorate([
    (0, rest_1.get)('/camps/{id}/donors'),
    (0, rest_1.response)(200, {
        description: 'Array of Donor model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Donor),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "getCampDonors", null);
tslib_1.__decorate([
    (0, rest_1.get)('/camps/{id}/sendEmailsToDonors'),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], CampController.prototype, "sendEmailsToDonors", null);
CampController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CampRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.DonorRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CampRepository,
        repositories_1.DonorRepository])
], CampController);
exports.CampController = CampController;
//# sourceMappingURL=camp.controller.js.map