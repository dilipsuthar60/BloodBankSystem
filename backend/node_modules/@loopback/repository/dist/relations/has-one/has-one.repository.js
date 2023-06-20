"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHasOneRepository = void 0;
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const repositories_1 = require("../../repositories");
class DefaultHasOneRepository {
    /**
     * Constructor of DefaultHasOneEntityCrudRepository
     * @param getTargetRepository  - either a dictionary of target model type - target repository instance
     * or a single target repository instance
     * e.g. if the target is of a non-polymorphic type "Student", put the studentRepositoryGetterInstance
     * if the target is of a polymorphic type "Person" which can be either a "Student" or a "Teacher"
     * then put "{Student: studentRepositoryGetterInstance, Teacher: teacherRepositoryGetterInstance}"
     * @param constraint - the key value pair representing foreign key name to constrain
     * the target repository instance
     * @param targetResolver - () => Target to resolve the target class
     * e.g. if the target is of type "Student", then put "() => Student"
     */
    constructor(getTargetRepository, constraint, targetResolver) {
        this.getTargetRepository = getTargetRepository;
        this.constraint = constraint;
        this.targetResolver = targetResolver;
        if (typeof getTargetRepository === 'function') {
            this.getTargetRepositoryDict = {
                [targetResolver().name]: getTargetRepository,
            };
        }
        else {
            this.getTargetRepositoryDict = getTargetRepository;
        }
    }
    async create(targetModelData, options) {
        let polymorphicTypeName = options === null || options === void 0 ? void 0 : options.polymorphicType;
        if (polymorphicTypeName) {
            if (!this.getTargetRepositoryDict[polymorphicTypeName]) {
                throw new errors_1.InvalidPolymorphismError(polymorphicTypeName);
            }
        }
        else {
            if (Object.keys(this.getTargetRepositoryDict).length > 1) {
                console.warn('It is highly recommended to specify the polymorphicType param when using polymorphic types.');
            }
            polymorphicTypeName = this.targetResolver().name;
            if (!this.getTargetRepositoryDict[polymorphicTypeName]) {
                throw new errors_1.InvalidPolymorphismError(polymorphicTypeName);
            }
        }
        const targetRepository = await this.getTargetRepositoryDict[polymorphicTypeName]();
        return targetRepository.create((0, repositories_1.constrainDataObject)(targetModelData, this.constraint), options);
    }
    async get(filter, options) {
        let polymorphicTypes = options === null || options === void 0 ? void 0 : options.polymorphicType;
        let allKeys;
        if (Object.keys(this.getTargetRepositoryDict).length <= 1) {
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else if (!polymorphicTypes || polymorphicTypes.length === 0) {
            console.warn('It is highly recommended to specify the polymorphicType param when using polymorphic types.');
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else {
            if (typeof polymorphicTypes === 'string') {
                polymorphicTypes = [polymorphicTypes];
            }
            allKeys = [];
            new Set(polymorphicTypes).forEach(element => {
                if (Object.keys(this.getTargetRepositoryDict).includes(element)) {
                    allKeys.push(element);
                }
            });
        }
        for (const key of allKeys) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            const found = await targetRepository.find(Object.assign({ limit: 1 }, (0, repositories_1.constrainFilter)(filter, this.constraint)), Object.assign((0, lodash_1.cloneDeep)(options !== null && options !== void 0 ? options : {}), { polymorphicType: key }));
            if (found.length >= 1) {
                return found[0];
            }
        }
        // We don't have a direct access to the foreign key value here :(
        const id = 'constraint ' + JSON.stringify(this.constraint);
        throw new errors_1.EntityNotFoundError(this.targetResolver().name, id);
    }
    async delete(options) {
        var _a, _b;
        let polymorphicTypes = options === null || options === void 0 ? void 0 : options.polymorphicType;
        let allKeys;
        if (Object.keys(this.getTargetRepositoryDict).length <= 1) {
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else if (!polymorphicTypes || polymorphicTypes.length === 0) {
            console.warn('It is highly recommended to specify the polymorphicType param when using polymorphic types.');
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else {
            if (typeof polymorphicTypes === 'string') {
                polymorphicTypes = [polymorphicTypes];
            }
            allKeys = [];
            new Set(polymorphicTypes).forEach(element => {
                if (Object.keys(this.getTargetRepositoryDict).includes(element)) {
                    allKeys.push(element);
                }
            });
        }
        let total = 0;
        for (const key of allKeys) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            total +=
                (_b = (_a = (await targetRepository.deleteAll((0, repositories_1.constrainWhere)({}, this.constraint), options))) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        }
        return { count: total };
    }
    async patch(dataObject, options) {
        var _a, _b;
        const isMultipleTypes = options === null || options === void 0 ? void 0 : options.isPolymorphic;
        let allKeys;
        if (!isMultipleTypes) {
            if (Object.keys(this.getTargetRepositoryDict).length > 1) {
                console.warn('It is highly recommended to specify the isPolymorphic param and pass in a dictionary of dataobjects when using polymorphic types.');
            }
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else {
            allKeys = [];
            new Set(Object.keys(dataObject)).forEach(element => {
                if (Object.keys(this.getTargetRepositoryDict).includes(element)) {
                    allKeys.push(element);
                }
            });
        }
        let total = 0;
        for (const key of allKeys) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            total +=
                (_b = (_a = (await targetRepository.updateAll((0, repositories_1.constrainDataObject)(isMultipleTypes
                    ? dataObject[key]
                    : dataObject, this.constraint), (0, repositories_1.constrainWhere)({}, this.constraint), options))) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        }
        return { count: total };
    }
}
exports.DefaultHasOneRepository = DefaultHasOneRepository;
//# sourceMappingURL=has-one.repository.js.map