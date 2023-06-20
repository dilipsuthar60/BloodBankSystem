"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHasManyThroughRepositoryFactory = void 0;
const has_many_through_helpers_1 = require("./has-many-through.helpers");
const has_many_through_inclusion_resolver_1 = require("./has-many-through.inclusion-resolver");
const has_many_through_repository_1 = require("./has-many-through.repository");
function createHasManyThroughRepositoryFactory(relationMetadata, targetRepositoryGetter, throughRepositoryGetter) {
    const meta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(relationMetadata);
    // resolve the repositoryGetter into a dictionary
    if (typeof targetRepositoryGetter === 'function') {
        targetRepositoryGetter = {
            [meta.target().name]: targetRepositoryGetter,
        };
    }
    const result = function (fkValue) {
        function getTargetConstraintFromThroughModels(throughInstances) {
            return (0, has_many_through_helpers_1.createTargetConstraintFromThrough)(meta, throughInstances);
        }
        function getTargetKeys(throughInstances) {
            return (0, has_many_through_helpers_1.getTargetKeysFromThroughModels)(meta, throughInstances);
        }
        function getThroughConstraintFromSource() {
            const constraint = (0, has_many_through_helpers_1.createThroughConstraintFromSource)(meta, fkValue);
            return constraint;
        }
        function getTargetIds(targetInstances) {
            return (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(meta, targetInstances);
        }
        function getThroughConstraintFromTarget(fkValues) {
            const constraint = (0, has_many_through_helpers_1.createThroughConstraintFromTarget)(meta, fkValues);
            return constraint;
        }
        return new has_many_through_repository_1.DefaultHasManyThroughRepository(targetRepositoryGetter, throughRepositoryGetter, getTargetConstraintFromThroughModels, getTargetKeys, getThroughConstraintFromSource, getTargetIds, getThroughConstraintFromTarget, relationMetadata.target, relationMetadata.through.model);
    };
    result.inclusionResolver = (0, has_many_through_inclusion_resolver_1.createHasManyThroughInclusionResolver)(meta, throughRepositoryGetter, targetRepositoryGetter);
    return result;
}
exports.createHasManyThroughRepositoryFactory = createHasManyThroughRepositoryFactory;
//# sourceMappingURL=has-many-through.repository-factory.js.map