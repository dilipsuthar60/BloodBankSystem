"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHasManyThroughMetadata = exports.createThroughConstraintFromTarget = exports.getTargetIdsFromTargetModels = exports.createThroughConstraintFromSource = exports.getTargetKeysFromThroughModels = exports.createTargetConstraintFromThrough = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = require("lodash");
const __1 = require("../..");
const has_many_helpers_1 = require("./has-many.helpers");
const debug = (0, debug_1.default)('loopback:repository:relations:has-many-through:helpers');
/**
 * Creates target constraint based on through models
 * @param relationMeta - resolved hasManyThrough metadata
 * @param throughInstances - an array of through instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createTargetConstraintFromThrough(resolvedMetadata,[{
        id: 2,
        categoryId: 2,
        productId: 8,
      }]);
 * >>> {id: 8}
 * createTargetConstraintFromThrough(resolvedMetadata, [
      {
        id: 2,
        categoryId: 2,
        productId: 8,
      }, {
        id: 1,
        categoryId: 2,
        productId: 9,
      }
  ]);

  >>> {id: {inq: [9, 8]}}
 * ```
 */
function createTargetConstraintFromThrough(relationMeta, throughInstances) {
    const fkValues = getTargetKeysFromThroughModels(relationMeta, throughInstances);
    const targetPrimaryKey = relationMeta.keyTo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraint = {
        [targetPrimaryKey]: fkValues.length === 1 ? fkValues[0] : { inq: fkValues },
    };
    return constraint;
}
exports.createTargetConstraintFromThrough = createTargetConstraintFromThrough;
/**
 * Returns an array of target fks of the given throughInstances.
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param throughInstances - an array of through instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * getTargetKeysFromThroughModels(resolvedMetadata,[{
        id: 2,
        categoryId: 2,
        productId: 8,
      }]);
 * >>> [8]
 * getTargetKeysFromThroughModels(resolvedMetadata, [
      {
        id: 2,
        categoryId: 2,
        productId: 8,
      }, {
        id: 1,
        categoryId: 2,
        productId: 9,
      }
  ]);
  >>> [8, 9]
 */
function getTargetKeysFromThroughModels(relationMeta, throughInstances) {
    const targetFkName = relationMeta.through.keyTo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fkValues = throughInstances.map((throughInstance) => throughInstance[targetFkName]);
    fkValues = (0, __1.deduplicate)(fkValues);
    return fkValues;
}
exports.getTargetKeysFromThroughModels = getTargetKeysFromThroughModels;
/**
 * Creates through constraint based on the source key
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param fkValue - foreign key of the source instance
 * @internal
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createThroughConstraintFromSource(resolvedMetadata, 1);
 *
 * >>> {categoryId: 1}
 * ```
 */
function createThroughConstraintFromSource(relationMeta, fkValue) {
    const sourceFkName = relationMeta.through.keyFrom;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraint = { [sourceFkName]: fkValue };
    return constraint;
}
exports.createThroughConstraintFromSource = createThroughConstraintFromSource;
/**
 * Returns an array of target ids of the given target instances.
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param targetInstances - an array of target instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * getTargetKeysFromTargetModels(resolvedMetadata,[{
        id: 2,
        des: 'a target',
      }]);
 * >>> [2]
 * getTargetKeysFromTargetModels(resolvedMetadata, [
      {
        id: 2,
        des: 'a target',
      }, {
        id: 1,
        des: 'a target',
      }
  ]);
  >>> [2, 1]
 */
function getTargetIdsFromTargetModels(relationMeta, targetInstances) {
    const targetId = relationMeta.keyTo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ids = [];
    ids = targetInstances.map((targetInstance) => targetInstance[targetId]);
    ids = (0, __1.deduplicate)(ids);
    return ids;
}
exports.getTargetIdsFromTargetModels = getTargetIdsFromTargetModels;
/**
 * Creates through constraint based on the target foreign key
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param fkValue an array of the target instance foreign keys
 * @internal
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createThroughConstraintFromTarget(resolvedMetadata, [3]);
 *
 * >>> {productId: 3}
 *
 * createThroughConstraintFromTarget(resolvedMetadata, [3,4]);
 *
 * >>> {productId: {inq:[3,4]}}
 */
function createThroughConstraintFromTarget(relationMeta, fkValues) {
    if (fkValues === undefined || fkValues.length === 0) {
        throw new Error('"fkValue" must be provided');
    }
    const targetFkName = relationMeta.through.keyTo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraint = fkValues.length === 1
        ? { [targetFkName]: fkValues[0] }
        : { [targetFkName]: { inq: fkValues } };
    return constraint;
}
exports.createThroughConstraintFromTarget = createThroughConstraintFromTarget;
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta - hasManyThrough metadata to resolve
 * @internal
 */
function resolveHasManyThroughMetadata(relationMeta) {
    var _a, _b, _c, _d, _e, _f;
    // some checks and relationMeta.keyFrom are handled in here
    relationMeta = (0, has_many_helpers_1.resolveHasManyMetaHelper)(relationMeta);
    if (!relationMeta.through) {
        const reason = 'through must be specified';
        throw new __1.InvalidRelationError(reason, relationMeta);
    }
    if (!(0, __1.isTypeResolver)((_a = relationMeta.through) === null || _a === void 0 ? void 0 : _a.model)) {
        const reason = 'through.model must be a type resolver';
        throw new __1.InvalidRelationError(reason, relationMeta);
    }
    const throughModel = relationMeta.through.model();
    const throughModelProperties = (_b = throughModel.definition) === null || _b === void 0 ? void 0 : _b.properties;
    const targetModel = relationMeta.target();
    const targetModelProperties = (_c = targetModel.definition) === null || _c === void 0 ? void 0 : _c.properties;
    // check if metadata is already complete
    if (relationMeta.through.keyTo &&
        throughModelProperties[relationMeta.through.keyTo] &&
        relationMeta.through.keyFrom &&
        throughModelProperties[relationMeta.through.keyFrom] &&
        relationMeta.keyTo &&
        targetModelProperties[relationMeta.keyTo] &&
        (relationMeta.through.polymorphic === false ||
            (typeof relationMeta.through.polymorphic === 'object' &&
                relationMeta.through.polymorphic.discriminator.length > 0))) {
        // The explicit cast is needed because of a limitation of type inference
        return relationMeta;
    }
    const sourceModel = relationMeta.source;
    debug('Resolved model %s from given metadata: %o', targetModel.modelName, targetModel);
    debug('Resolved model %s from given metadata: %o', throughModel.modelName, throughModel);
    const sourceFkName = (_d = relationMeta.through.keyFrom) !== null && _d !== void 0 ? _d : (0, lodash_1.camelCase)(sourceModel.modelName + '_id');
    if (!throughModelProperties[sourceFkName]) {
        const reason = `through model ${throughModel.name} is missing definition of source foreign key`;
        throw new __1.InvalidRelationError(reason, relationMeta);
    }
    const targetFkName = (_e = relationMeta.through.keyTo) !== null && _e !== void 0 ? _e : (0, lodash_1.camelCase)(targetModel.modelName + '_id');
    if (!throughModelProperties[targetFkName]) {
        const reason = `through model ${throughModel.name} is missing definition of target foreign key`;
        throw new __1.InvalidRelationError(reason, relationMeta);
    }
    const targetPrimaryKey = (_f = relationMeta.keyTo) !== null && _f !== void 0 ? _f : targetModel.definition.idProperties()[0];
    if (!targetPrimaryKey || !targetModelProperties[targetPrimaryKey]) {
        const reason = `target model ${targetModel.modelName} does not have any primary key (id property)`;
        throw new __1.InvalidRelationError(reason, relationMeta);
    }
    let throughPolymorphic;
    if (relationMeta.through.polymorphic === undefined ||
        relationMeta.through.polymorphic === false ||
        !relationMeta.through.polymorphic) {
        const polymorphicFalse = false;
        throughPolymorphic = polymorphicFalse;
    }
    else {
        if (relationMeta.through.polymorphic === true) {
            const polymorphicObject = {
                discriminator: (0, lodash_1.camelCase)(relationMeta.target().name + '_type'),
            };
            throughPolymorphic = polymorphicObject;
        }
        else {
            const polymorphicObject = relationMeta.through
                .polymorphic;
            throughPolymorphic = polymorphicObject;
        }
    }
    return Object.assign(relationMeta, {
        keyTo: targetPrimaryKey,
        keyFrom: relationMeta.keyFrom,
        through: {
            ...relationMeta.through,
            keyTo: targetFkName,
            keyFrom: sourceFkName,
            polymorphic: throughPolymorphic,
        },
    });
}
exports.resolveHasManyThroughMetadata = resolveHasManyThroughMetadata;
//# sourceMappingURL=has-many-through.helpers.js.map