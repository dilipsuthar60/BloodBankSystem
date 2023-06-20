"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHasOneRepositoryFactory = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const has_one_helpers_1 = require("./has-one.helpers");
const has_one_inclusion_resolver_1 = require("./has-one.inclusion-resolver");
const has_one_repository_1 = require("./has-one.repository");
const debug = (0, debug_1.default)('loopback:repository:relations:has-one:repository-factory');
/**
 * Enforces a constraint on a repository based on a relationship contract
 * between models. For example, if a Customer model is related to an Address model
 * via a HasOne relation, then, the relational repository returned by the
 * factory function would be constrained by a Customer model instance's id(s).
 *
 * If the target model is polymorphic, i.e. stored within different repositories,
 * supply the targetRepositoryGetter with a dictionary in the form of {[typeName: string]: repositoryGetter}
 *
 * @param relationMetadata - The relation metadata used to describe the
 * relationship and determine how to apply the constraint.
 * @param targetRepositoryGetter - The repository or a dictionary of classname - repository,
 * which represents the target model of a relation attached to a datasource.
 * For the dictionary, the key is the class name of the concrete class the the polymorphic model.
 * @returns The factory function which accepts a foreign key value to constrain
 * the given target repository
 */
function createHasOneRepositoryFactory(relationMetadata, targetRepositoryGetter) {
    const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(relationMetadata);
    // resolve the repositoryGetter into a dictionary
    if (typeof targetRepositoryGetter === 'function') {
        targetRepositoryGetter = {
            [meta.target().name]: targetRepositoryGetter,
        };
    }
    debug('Resolved HasOne relation metadata: %o', meta);
    const result = function (fkValue) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constraint = { [meta.keyTo]: fkValue };
        return new has_one_repository_1.DefaultHasOneRepository(targetRepositoryGetter, constraint, relationMetadata.target);
    };
    result.inclusionResolver = (0, has_one_inclusion_resolver_1.createHasOneInclusionResolver)(meta, targetRepositoryGetter);
    return result;
}
exports.createHasOneRepositoryFactory = createHasOneRepositoryFactory;
//# sourceMappingURL=has-one.repository-factory.js.map