"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHasManyInclusionResolver = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const relation_helpers_1 = require("../relation.helpers");
const has_many_helpers_1 = require("./has-many.helpers");
const debug = (0, debug_1.default)('loopback:repository:relations:has-many:inclusion-resolver');
/**
 * Creates InclusionResolver for HasMany relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 * Notice: scope field for inclusion is not supported yet.
 *
 * @param meta - resolved metadata of the hasMany relation
 * @param getTargetRepo - target repository i.e where related instances are
 */
function createHasManyInclusionResolver(meta, getTargetRepo) {
    const relationMeta = (0, has_many_helpers_1.resolveHasManyMetadata)(meta);
    return async function fetchHasManyModels(entities, inclusion, options) {
        if (!entities.length)
            return [];
        debug('Fetching target models for entities:', entities);
        debug('Relation metadata:', relationMeta);
        const sourceKey = relationMeta.keyFrom;
        const sourceIds = entities.map(e => e[sourceKey]);
        const targetKey = relationMeta.keyTo;
        debug('Parameters:', { sourceKey, sourceIds, targetKey });
        debug('sourceId types', sourceIds.map(i => typeof i));
        const scope = typeof inclusion === 'string' ? {} : inclusion.scope;
        const targetRepo = await getTargetRepo();
        const targetsFound = await (0, relation_helpers_1.findByForeignKeys)(targetRepo, targetKey, sourceIds, scope, options);
        debug('Targets found:', targetsFound);
        const result = (0, relation_helpers_1.flattenTargetsOfOneToManyRelation)(sourceIds, targetsFound, targetKey);
        debug('fetchHasManyModels result', result);
        return result;
    };
}
exports.createHasManyInclusionResolver = createHasManyInclusionResolver;
//# sourceMappingURL=has-many.inclusion-resolver.js.map