"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBelongsToAccessor = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const belongs_to_helpers_1 = require("./belongs-to.helpers");
const belongs_to_inclusion_resolver_1 = require("./belongs-to.inclusion-resolver");
const belongs_to_repository_1 = require("./belongs-to.repository");
const debug = (0, debug_1.default)('loopback:repository:relations:belongs-to:accessor');
/**
 * Enforces a BelongsTo constraint on a repository
 * If the target model is polymorphic, i.e. stored within different repositories,
 * supply the targetRepositoryGetter with a dictionary in the form of {[typeName: string]: repositoryGetter}
 */
function createBelongsToAccessor(belongsToMetadata, targetRepositoryGetter, sourceRepository) {
    const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(belongsToMetadata);
    // resolve the repositoryGetter into a dictionary
    if (typeof targetRepositoryGetter === 'function') {
        targetRepositoryGetter = {
            [meta.target().name]: targetRepositoryGetter,
        };
    }
    debug('Resolved BelongsTo relation metadata: %o', meta);
    const result = async function getTargetInstanceOfBelongsTo(sourceId, polymorphicTypes) {
        if (meta.polymorphic !== false) {
            if (!polymorphicTypes || polymorphicTypes.length === 0) {
                console.warn('It is highly recommended to specify the polymorphicTypes param when using polymorphic types.');
            }
        }
        const foreignKey = meta.keyFrom;
        const primaryKey = meta.keyTo;
        const sourceModel = await sourceRepository.findById(sourceId);
        const foreignKeyValue = sourceModel[foreignKey];
        // workaround to check referential integrity.
        // should be removed once the memory connector ref integrity is done
        // GH issue: https://github.com/loopbackio/loopback-next/issues/2333
        if (!foreignKeyValue) {
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constraint = { [primaryKey]: foreignKeyValue };
        const constrainedRepo = new belongs_to_repository_1.DefaultBelongsToRepository(targetRepositoryGetter, constraint, belongsToMetadata.target);
        return constrainedRepo.get({ polymorphicType: polymorphicTypes });
    };
    result.inclusionResolver = (0, belongs_to_inclusion_resolver_1.createBelongsToInclusionResolver)(meta, targetRepositoryGetter);
    return result;
}
exports.createBelongsToAccessor = createBelongsToAccessor;
//# sourceMappingURL=belongs-to.accessor.js.map