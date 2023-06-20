"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBelongsToRepository = void 0;
const lodash_1 = require("lodash");
const __1 = require("../../");
const repositories_1 = require("../../repositories");
class DefaultBelongsToRepository {
    /**
     * Constructor of DefaultBelongsToEntityCrudRepository
     * @param getTargetRepository - either a dictionary of target model type - target repository instance
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
    async get(options) {
        let polymorphicTypes = options === null || options === void 0 ? void 0 : options.polymorphicType;
        let allKeys;
        if (Object.keys(this.getTargetRepositoryDict).length <= 1) {
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else if (!polymorphicTypes || polymorphicTypes.length === 0) {
            console.warn('It is highly recommended to specify the polymorphicTypes param when using polymorphic types.');
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
        let result = [];
        for (const key of allKeys) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            result = result.concat(await targetRepository.find((0, repositories_1.constrainFilter)(undefined, this.constraint), Object.assign((0, lodash_1.cloneDeep)(options !== null && options !== void 0 ? options : {}), { polymorphicType: key })));
            if (result.length >= 1) {
                return result[0];
            }
        }
        // We don't have a direct access to the foreign key value here :(
        const id = 'constraint ' + JSON.stringify(this.constraint);
        throw new __1.EntityNotFoundError(this.targetResolver().name, id);
    }
}
exports.DefaultBelongsToRepository = DefaultBelongsToRepository;
//# sourceMappingURL=belongs-to.repository.js.map