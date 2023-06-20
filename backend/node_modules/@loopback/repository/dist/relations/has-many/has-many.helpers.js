"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHasManyMetaHelper = exports.resolveHasManyMetadata = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const type_resolver_1 = require("../../type-resolver");
const relation_types_1 = require("../relation.types");
const debug = (0, debug_1.default)('loopback:repository:relations:has-many:helpers');
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta - hasMany metadata to resolve
 * @internal
 */
function resolveHasManyMetadata(relationMeta) {
    var _a;
    // some checks and relationMeta.keyFrom are handled in here
    relationMeta = resolveHasManyMetaHelper(relationMeta);
    const targetModel = relationMeta.target();
    const targetModelProperties = (_a = targetModel.definition) === null || _a === void 0 ? void 0 : _a.properties;
    const sourceModel = relationMeta.source;
    if (relationMeta.keyTo && targetModelProperties[relationMeta.keyTo]) {
        // The explicit cast is needed because of a limitation of type inference
        return relationMeta;
    }
    debug('Resolved model %s from given metadata: %o', targetModel.modelName, targetModel);
    const defaultFkName = (0, lodash_1.camelCase)(sourceModel.modelName + '_id');
    const hasDefaultFkProperty = targetModelProperties[defaultFkName];
    if (!hasDefaultFkProperty) {
        const reason = `target model ${targetModel.name} is missing definition of foreign key ${defaultFkName}`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    return Object.assign(relationMeta, {
        keyTo: defaultFkName,
    });
}
exports.resolveHasManyMetadata = resolveHasManyMetadata;
/**
 * A helper to check relation type and the existence of the source/target models
 * and set up keyFrom
 * for HasMany(Through) relations
 * @param relationMeta
 *
 * @returns relationMeta that has set up keyFrom
 */
function resolveHasManyMetaHelper(relationMeta) {
    if (relationMeta.type !== relation_types_1.RelationType.hasMany) {
        const reason = 'relation type must be HasMany';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    if (!(0, type_resolver_1.isTypeResolver)(relationMeta.target)) {
        const reason = 'target must be a type resolver';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const sourceModel = relationMeta.source;
    if (!(sourceModel === null || sourceModel === void 0 ? void 0 : sourceModel.modelName)) {
        const reason = 'source model must be defined';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    let keyFrom;
    if (relationMeta.keyFrom &&
        relationMeta.source.definition.properties[relationMeta.keyFrom]) {
        keyFrom = relationMeta.keyFrom;
    }
    else {
        keyFrom = sourceModel.getIdProperties()[0];
    }
    return Object.assign(relationMeta, { keyFrom });
}
exports.resolveHasManyMetaHelper = resolveHasManyMetaHelper;
//# sourceMappingURL=has-many.helpers.js.map