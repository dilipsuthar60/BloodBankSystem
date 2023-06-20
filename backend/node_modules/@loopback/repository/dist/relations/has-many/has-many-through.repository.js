"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHasManyThroughRepository = void 0;
const lodash_1 = require("lodash");
const __1 = require("../..");
/**
 * a class for CRUD operations for hasManyThrough relation.
 *
 * Warning: The hasManyThrough interface is experimental and is subject to change.
 * If backwards-incompatible changes are made, a new major version may not be
 * released.
 */
class DefaultHasManyThroughRepository {
    constructor(getTargetRepository, getThroughRepository, getTargetConstraintFromThroughModels, getTargetKeys, getThroughConstraintFromSource, getTargetIds, getThroughConstraintFromTarget, targetResolver, throughResolver) {
        this.getTargetRepository = getTargetRepository;
        this.getThroughRepository = getThroughRepository;
        this.getTargetConstraintFromThroughModels = getTargetConstraintFromThroughModels;
        this.getTargetKeys = getTargetKeys;
        this.getThroughConstraintFromSource = getThroughConstraintFromSource;
        this.getTargetIds = getTargetIds;
        this.getThroughConstraintFromTarget = getThroughConstraintFromTarget;
        this.targetResolver = targetResolver;
        this.throughResolver = throughResolver;
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
        let targetPolymorphicTypeName = options === null || options === void 0 ? void 0 : options.polymorphicType;
        if (targetPolymorphicTypeName) {
            if (!this.getTargetRepositoryDict[targetPolymorphicTypeName]) {
                throw new __1.InvalidPolymorphismError(targetPolymorphicTypeName);
            }
        }
        else {
            if (Object.keys(this.getTargetRepositoryDict).length > 1) {
                console.warn('It is highly recommended to specify the polymorphicTypes param when using polymorphic types.');
            }
            targetPolymorphicTypeName = this.targetResolver().name;
            if (!this.getTargetRepositoryDict[targetPolymorphicTypeName]) {
                throw new __1.InvalidPolymorphismError(targetPolymorphicTypeName);
            }
        }
        const targetRepository = await this.getTargetRepositoryDict[targetPolymorphicTypeName]();
        const targetInstance = await targetRepository.create(targetModelData, options);
        await this.link(targetInstance.getId(), options);
        return targetInstance;
    }
    async find(filter, options) {
        var _a;
        const targetDiscriminatorOnThrough = (_a = options === null || options === void 0 ? void 0 : options.throughOptions) === null || _a === void 0 ? void 0 : _a.discriminator;
        let targetPolymorphicTypes = options === null || options === void 0 ? void 0 : options.polymorphicType;
        let allKeys;
        if (Object.keys(this.getTargetRepositoryDict).length <= 1) {
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else {
            if (!targetDiscriminatorOnThrough) {
                console.warn('It is highly recommended to specify the targetDiscriminatorOnThrough param when using polymorphic types.');
            }
            if (!targetPolymorphicTypes || targetPolymorphicTypes.length === 0) {
                console.warn('It is highly recommended to specify the polymorphicTypes param when using polymorphic types.');
                allKeys = Object.keys(this.getTargetRepositoryDict);
            }
            else {
                if (typeof targetPolymorphicTypes === 'string') {
                    targetPolymorphicTypes = [targetPolymorphicTypes];
                }
                allKeys = [];
                new Set(targetPolymorphicTypes).forEach(element => {
                    if (Object.keys(this.getTargetRepositoryDict).includes(element)) {
                        allKeys.push(element);
                    }
                });
            }
        }
        const sourceConstraint = this.getThroughConstraintFromSource();
        const throughCategorized = {};
        const throughRepository = await this.getThroughRepository();
        (await throughRepository.find((0, __1.constrainFilter)(undefined, sourceConstraint), options === null || options === void 0 ? void 0 : options.throughOptions)).forEach(element => {
            let concreteTargetType;
            if (!targetDiscriminatorOnThrough) {
                concreteTargetType = this.targetResolver().name;
            }
            else {
                concreteTargetType = String(element[targetDiscriminatorOnThrough]);
            }
            if (!allKeys.includes(concreteTargetType)) {
                return;
            }
            if (!this.getTargetRepositoryDict[concreteTargetType]) {
                throw new __1.InvalidPolymorphismError(concreteTargetType, targetDiscriminatorOnThrough);
            }
            if (!throughCategorized[concreteTargetType]) {
                throughCategorized[concreteTargetType] = [];
            }
            throughCategorized[concreteTargetType].push(element);
        });
        let allTargets = [];
        for (const key of Object.keys(throughCategorized)) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            const targetConstraint = this.getTargetConstraintFromThroughModels(throughCategorized[key]);
            allTargets = allTargets.concat(await targetRepository.find((0, __1.constrainFilter)(filter, targetConstraint), Object.assign((0, lodash_1.cloneDeep)(options !== null && options !== void 0 ? options : {}), { polymorphicType: key })));
        }
        return allTargets;
    }
    async delete(where, options) {
        var _a, _b, _c;
        const targetDiscriminatorOnThrough = (_a = options === null || options === void 0 ? void 0 : options.throughOptions) === null || _a === void 0 ? void 0 : _a.discriminator;
        let targetPolymorphicTypes = options === null || options === void 0 ? void 0 : options.polymorphicType;
        let allKeys;
        if (Object.keys(this.getTargetRepositoryDict).length <= 1) {
            allKeys = Object.keys(this.getTargetRepositoryDict);
        }
        else {
            if (!targetDiscriminatorOnThrough) {
                console.warn('It is highly recommended to specify the targetDiscriminatorOnThrough param when using polymorphic types.');
            }
            if (!targetPolymorphicTypes || targetPolymorphicTypes.length === 0) {
                console.warn('It is highly recommended to specify the polymorphicTypes param when using polymorphic types.');
                allKeys = Object.keys(this.getTargetRepositoryDict);
            }
            else {
                if (typeof targetPolymorphicTypes === 'string') {
                    targetPolymorphicTypes = [targetPolymorphicTypes];
                }
                allKeys = [];
                new Set(targetPolymorphicTypes).forEach(element => {
                    if (Object.keys(this.getTargetRepositoryDict).includes(element)) {
                        allKeys.push(element);
                    }
                });
            }
        }
        const sourceConstraint = this.getThroughConstraintFromSource();
        let totalCount = 0;
        const throughCategorized = {};
        const throughRepository = await this.getThroughRepository();
        (await throughRepository.find((0, __1.constrainFilter)(undefined, sourceConstraint), options === null || options === void 0 ? void 0 : options.throughOptions)).forEach(element => {
            let concreteTargetType;
            if (!targetDiscriminatorOnThrough) {
                concreteTargetType = this.targetResolver().name;
            }
            else {
                concreteTargetType = String(element[targetDiscriminatorOnThrough]);
            }
            if (!allKeys.includes(concreteTargetType)) {
                return;
            }
            if (!this.getTargetRepositoryDict[concreteTargetType]) {
                throw new __1.InvalidPolymorphismError(concreteTargetType, targetDiscriminatorOnThrough);
            }
            if (!throughCategorized[concreteTargetType]) {
                throughCategorized[concreteTargetType] = [];
            }
            throughCategorized[concreteTargetType].push(element);
        });
        for (const targetKey of Object.keys(throughCategorized)) {
            const targetRepository = await this.getTargetRepositoryDict[targetKey]();
            if (where) {
                // only delete related through models
                // TODO(Agnes): this performance can be improved by only fetching related data
                // TODO: add target ids to the `where` constraint
                const targets = await targetRepository.find({ where });
                const targetIds = this.getTargetIds(targets);
                if (targetIds.length > 0) {
                    const targetConstraint = this.getThroughConstraintFromTarget(targetIds);
                    const constraints = { ...targetConstraint, ...sourceConstraint };
                    await throughRepository.deleteAll((0, __1.constrainDataObject)({}, constraints), options === null || options === void 0 ? void 0 : options.throughOptions);
                }
            }
            else {
                // otherwise, delete through models that relate to the sourceId
                const targetFkValues = this.getTargetKeys(throughCategorized[targetKey]);
                // delete through instances that have the targets that are going to be deleted
                const throughFkConstraint = this.getThroughConstraintFromTarget(targetFkValues);
                await throughRepository.deleteAll((0, __1.constrainWhereOr)({}, [
                    sourceConstraint,
                    throughFkConstraint,
                ]));
            }
            // delete target(s)
            const targetConstraint = this.getTargetConstraintFromThroughModels(throughCategorized[targetKey]);
            totalCount +=
                (_c = (_b = (await targetRepository.deleteAll((0, __1.constrainWhere)(where, targetConstraint), options))) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
        }
        return { count: totalCount };
    }
    // only allows patch target instances for now
    async patch(dataObject, where, options) {
        var _a, _b, _c;
        const targetDiscriminatorOnThrough = (_a = options === null || options === void 0 ? void 0 : options.throughOptions) === null || _a === void 0 ? void 0 : _a.discriminator;
        const isMultipleTypes = options === null || options === void 0 ? void 0 : options.isPolymorphic;
        let allKeys;
        if (!targetDiscriminatorOnThrough) {
            if (Object.keys(this.getTargetRepositoryDict).length > 1) {
                console.warn('It is highly recommended to specify the targetDiscriminatorOnThrough param when using polymorphic types.');
            }
        }
        if (!isMultipleTypes) {
            if (Object.keys(this.getTargetRepositoryDict).length > 1) {
                console.warn('It is highly recommended to specify the isMultipleTypes param and pass in a dictionary of dataobjects when using polymorphic types.');
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
        const sourceConstraint = this.getThroughConstraintFromSource();
        const throughCategorized = {};
        const throughRepository = await this.getThroughRepository();
        (await throughRepository.find((0, __1.constrainFilter)(undefined, sourceConstraint), options === null || options === void 0 ? void 0 : options.throughOptions)).forEach(element => {
            let concreteTargetType;
            if (!targetDiscriminatorOnThrough) {
                concreteTargetType = this.targetResolver().name;
            }
            else {
                concreteTargetType = String(element[targetDiscriminatorOnThrough]);
            }
            if (!allKeys.includes(concreteTargetType)) {
                return;
            }
            if (!this.getTargetRepositoryDict[concreteTargetType]) {
                throw new __1.InvalidPolymorphismError(concreteTargetType, targetDiscriminatorOnThrough);
            }
            if (!throughCategorized[concreteTargetType]) {
                throughCategorized[concreteTargetType] = [];
            }
            throughCategorized[concreteTargetType].push(element);
        });
        let updatedCount = 0;
        for (const key of Object.keys(throughCategorized)) {
            const targetRepository = await this.getTargetRepositoryDict[key]();
            const targetConstraint = this.getTargetConstraintFromThroughModels(throughCategorized[key]);
            updatedCount +=
                (_c = (_b = (await targetRepository.updateAll((0, __1.constrainDataObject)(isMultipleTypes
                    ? dataObject[key]
                    : dataObject, targetConstraint), (0, __1.constrainWhere)(where, targetConstraint), options))) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
        }
        return { count: updatedCount };
    }
    async link(targetId, options) {
        var _a;
        const throughRepository = await this.getThroughRepository();
        const sourceConstraint = this.getThroughConstraintFromSource();
        const targetConstraint = this.getThroughConstraintFromTarget([targetId]);
        const constraints = { ...targetConstraint, ...sourceConstraint };
        await throughRepository.create((0, __1.constrainDataObject)((_a = options === null || options === void 0 ? void 0 : options.throughData) !== null && _a !== void 0 ? _a : {}, constraints), options === null || options === void 0 ? void 0 : options.throughOptions);
    }
    async unlink(targetId, options) {
        const throughRepository = await this.getThroughRepository();
        const sourceConstraint = this.getThroughConstraintFromSource();
        const targetConstraint = this.getThroughConstraintFromTarget([targetId]);
        const constraints = { ...targetConstraint, ...sourceConstraint };
        await throughRepository.deleteAll((0, __1.constrainDataObject)({}, constraints), options === null || options === void 0 ? void 0 : options.throughOptions);
    }
    async unlinkAll(options) {
        const throughRepository = await this.getThroughRepository();
        const sourceConstraint = this.getThroughConstraintFromSource();
        const throughInstances = await throughRepository.find((0, __1.constrainFilter)(undefined, sourceConstraint), options === null || options === void 0 ? void 0 : options.throughOptions);
        const targetFkValues = this.getTargetKeys(throughInstances);
        const targetConstraint = this.getThroughConstraintFromTarget(targetFkValues);
        const constraints = { ...targetConstraint, ...sourceConstraint };
        await throughRepository.deleteAll((0, __1.constrainDataObject)({}, constraints), options === null || options === void 0 ? void 0 : options.throughOptions);
    }
}
exports.DefaultHasManyThroughRepository = DefaultHasManyThroughRepository;
//# sourceMappingURL=has-many-through.repository.js.map