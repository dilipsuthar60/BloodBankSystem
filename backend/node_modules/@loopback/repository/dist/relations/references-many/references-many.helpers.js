"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReferencesManyMetadata = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const type_resolver_1 = require("../../type-resolver");
const relation_types_1 = require("../relation.types");
const debug = (0, debug_1.default)('loopback:repository:relations:references-many:helpers');
/**
 * Resolves given referencesMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * property id metadata
 * @param relationMeta - referencesMany metadata to resolve
 * @internal
 */
function resolveReferencesManyMetadata(relationMeta) {
    if (relationMeta.type !== relation_types_1.RelationType.referencesMany) {
        const reason = 'relation type must be ReferencesMany';
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
    const targetModel = relationMeta.target();
    const targetName = targetModel.modelName;
    debug('Resolved model %s from given metadata: %o', targetName, targetModel);
    let keyFrom;
    if (relationMeta.keyFrom &&
        relationMeta.source.definition.properties[relationMeta.keyFrom]) {
        keyFrom = relationMeta.keyFrom;
    }
    else {
        keyFrom = (0, lodash_1.camelCase)(targetName + '_ids');
    }
    const targetProperties = targetModel.definition.properties;
    debug('relation metadata from %o: %o', targetName, targetProperties);
    if (relationMeta.keyTo && targetProperties[relationMeta.keyTo]) {
        // The explicit cast is needed because of a limitation of type inference
        return Object.assign(relationMeta, {
            keyFrom,
        });
    }
    const targetPrimaryKey = targetModel.definition.idProperties()[0];
    if (!targetPrimaryKey) {
        const reason = `${targetName} does not have any primary key (id property)`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    return Object.assign(relationMeta, { keyFrom, keyTo: targetPrimaryKey });
}
exports.resolveReferencesManyMetadata = resolveReferencesManyMetadata;
//# sourceMappingURL=references-many.helpers.js.map