"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReferencesManyAccessor = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const references_many_helpers_1 = require("./references-many.helpers");
const references_many_inclusion_resolver_1 = require("./references-many.inclusion-resolver");
const references_many_repository_1 = require("./references-many.repository");
const debug = (0, debug_1.default)('loopback:repository:relations:references-many:accessor');
/**
 * Enforces a ReferencesMany constraint on a repository
 */
function createReferencesManyAccessor(referencesManyMetadata, targetRepoGetter, sourceRepository) {
    const meta = (0, references_many_helpers_1.resolveReferencesManyMetadata)(referencesManyMetadata);
    debug('Resolved ReferencesMany relation metadata: %o', meta);
    const result = async function getTargetInstancesOfReferencesMany(sourceId) {
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
        const constrainedRepo = new references_many_repository_1.DefaultReferencesManyRepository(targetRepoGetter, constraint);
        return constrainedRepo.get();
    };
    result.inclusionResolver = (0, references_many_inclusion_resolver_1.createReferencesManyInclusionResolver)(meta, targetRepoGetter);
    return result;
}
exports.createReferencesManyAccessor = createReferencesManyAccessor;
//# sourceMappingURL=references-many.accessor.js.map