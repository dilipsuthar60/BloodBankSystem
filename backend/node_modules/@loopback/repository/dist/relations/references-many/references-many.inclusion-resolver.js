"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReferencesManyInclusionResolver = void 0;
const relation_helpers_1 = require("../relation.helpers");
const references_many_helpers_1 = require("./references-many.helpers");
/**
 * Creates InclusionResolver for ReferencesMany relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 * Notice: scope field for inclusion is not supported yet
 *
 * @param meta - resolved ReferencesManyMetadata
 * @param getTargetRepo - target repository i.e where related instances are
 */
function createReferencesManyInclusionResolver(meta, getTargetRepo) {
    const relationMeta = (0, references_many_helpers_1.resolveReferencesManyMetadata)(meta);
    return async function fetchIncludedModels(entities, inclusion, options) {
        if (!entities.length)
            return [];
        const sourceKey = relationMeta.keyFrom;
        const sourceMap = entities.map(e => e[sourceKey]);
        const sourceIds = sourceMap.flat();
        const targetKey = relationMeta.keyTo;
        const dedupedSourceIds = (0, relation_helpers_1.deduplicate)(sourceIds);
        const scope = typeof inclusion === 'string' ? {} : inclusion.scope;
        const targetRepo = await getTargetRepo();
        const targetsFound = await (0, relation_helpers_1.findByForeignKeys)(targetRepo, targetKey, dedupedSourceIds.filter(e => e), scope, options);
        return sourceMap.map(chainIds => {
            if (!chainIds)
                return [];
            const targets = (0, relation_helpers_1.flattenTargetsOfOneToOneRelation)(chainIds, targetsFound, targetKey);
            return targets.filter((v) => v != null);
        });
    };
}
exports.createReferencesManyInclusionResolver = createReferencesManyInclusionResolver;
//# sourceMappingURL=references-many.inclusion-resolver.js.map