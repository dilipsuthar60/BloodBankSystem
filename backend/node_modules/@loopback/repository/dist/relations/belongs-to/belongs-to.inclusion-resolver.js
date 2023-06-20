"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBelongsToInclusionResolver = void 0;
const __1 = require("../../");
const relation_helpers_1 = require("../relation.helpers");
const belongs_to_helpers_1 = require("./belongs-to.helpers");
/**
 * Creates InclusionResolver for BelongsTo relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 * Notice: scope field for inclusion is not supported yet
 *
 * @param meta - resolved BelongsToMetadata
 * @param getTargetRepoDict - dictionary of target model type - target repository
 * i.e where related instances for different types are
 */
function createBelongsToInclusionResolver(meta, getTargetRepoDict) {
    const relationMeta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(meta);
    return async function fetchBelongsToModel(entities, inclusion, options) {
        if (!entities.length)
            return [];
        // Source ids are grouped by their target polymorphic types
        // Each type search for target instances and then merge together in a merge-sort-like manner
        const sourceKey = relationMeta.keyFrom;
        const targetKey = relationMeta.keyTo;
        const targetDiscriminator = relationMeta.polymorphic
            ? relationMeta.polymorphic.discriminator
            : undefined;
        const scope = typeof inclusion === 'string' ? {} : inclusion.scope;
        // sourceIds in {targetType -> sourceId}
        const sourceIdsCategorized = {};
        if (targetDiscriminator) {
            entities.forEach((value, index, allEntites) => {
                const concreteType = String(value[targetDiscriminator]);
                if (!getTargetRepoDict[concreteType]) {
                    throw new __1.InvalidPolymorphismError(concreteType, targetDiscriminator);
                }
                if (!sourceIdsCategorized[concreteType]) {
                    sourceIdsCategorized[concreteType] = [];
                }
                sourceIdsCategorized[concreteType].push(value[sourceKey]);
            });
        }
        else {
            const concreteType = relationMeta.target().name;
            if (!getTargetRepoDict[concreteType]) {
                throw new __1.InvalidPolymorphismError(concreteType);
            }
            entities.forEach((value, index, allEntites) => {
                if (!sourceIdsCategorized[concreteType]) {
                    sourceIdsCategorized[concreteType] = [];
                }
                sourceIdsCategorized[concreteType].push(value[sourceKey]);
            });
        }
        // Ensure targetKey is included otherwise flatten function cannot work
        const changedTargetKeyField = (0, __1.includeFieldIfNot)(scope === null || scope === void 0 ? void 0 : scope.fields, targetKey);
        let needToRemoveTargetKeyFieldLater = false;
        if (changedTargetKeyField !== false) {
            scope.fields = changedTargetKeyField;
            needToRemoveTargetKeyFieldLater = true;
        }
        // Each sourceIds array with same target type extract target instances
        const targetCategorized = {};
        for (const k of Object.keys(sourceIdsCategorized)) {
            const targetRepo = await getTargetRepoDict[k]();
            const targetsFound = await (0, relation_helpers_1.findByForeignKeys)(targetRepo, targetKey, (0, relation_helpers_1.deduplicate)(sourceIdsCategorized[k]).filter(e => e), scope, options);
            targetCategorized[k] = (0, relation_helpers_1.flattenTargetsOfOneToOneRelation)(sourceIdsCategorized[k], targetsFound, targetKey);
            // Remove targetKey if should be excluded but included above
            if (needToRemoveTargetKeyFieldLater) {
                targetCategorized[k] = targetCategorized[k].map(e => {
                    if (e) {
                        delete e[targetKey];
                    }
                    return e;
                });
            }
        }
        // Merge
        // Why the order is correct:
        // e.g. target model 1 = a, target model 2 = b
        // all entities: [S(a-1), S(a-2), S(b-3), S(a-4), S(b-5)]
        // a-result: [a-1, a-2, a-4]
        // b-result: [b-3, b-4]
        // merged:
        // entities[1]->a => targets: [a-1 from a-result.shift()]
        // entities[2]->a => targets: [a-1, a-2 from a-result.shift()]
        // entities[3]->b => targets: [a-1, a-2, b-3 from b-result.shift()]
        // entities[4]->a => targets: [a-1, a-2, b-3, a-4 from a-result.shift()]
        // entities[5]->b => targets: [a-1, a-2, b-3, a-4, b-5 from b-result.shift()]
        if (targetDiscriminator) {
            const allTargets = [];
            entities.forEach((value, index, allEntites) => {
                allTargets.push(targetCategorized[String(value[targetDiscriminator])].shift());
            });
            return allTargets;
        }
        else {
            return targetCategorized[relationMeta.target().name];
        }
    };
}
exports.createBelongsToInclusionResolver = createBelongsToInclusionResolver;
//# sourceMappingURL=belongs-to.inclusion-resolver.js.map