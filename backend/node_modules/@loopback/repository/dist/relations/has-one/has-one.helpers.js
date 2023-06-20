"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHasOneMetadata = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const type_resolver_1 = require("../../type-resolver");
const relation_types_1 = require("../relation.types");
const debug = (0, debug_1.default)('loopback:repository:relations:has-one:helpers');
/**
 * Resolves given hasOne metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * hasOne metadata
 * @param relationMeta - hasOne metadata to resolve
 * @internal
 */
function resolveHasOneMetadata(relationMeta) {
    var _a;
    if (relationMeta.type !== relation_types_1.RelationType.hasOne) {
        const reason = 'relation type must be HasOne';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    if (!(0, type_resolver_1.isTypeResolver)(relationMeta.target)) {
        const reason = 'target must be a type resolver';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetModel = relationMeta.target();
    const targetModelProperties = (_a = targetModel.definition) === null || _a === void 0 ? void 0 : _a.properties;
    const sourceModel = relationMeta.source;
    if (!(sourceModel === null || sourceModel === void 0 ? void 0 : sourceModel.modelName)) {
        const reason = 'source model must be defined';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    // keyFrom defaults to id property
    let keyFrom;
    if (relationMeta.keyFrom &&
        relationMeta.source.definition.properties[relationMeta.keyFrom]) {
        keyFrom = relationMeta.keyFrom;
    }
    else {
        keyFrom = sourceModel.getIdProperties()[0];
    }
    let keyTo;
    // Make sure that if it already keys to the foreign key property,
    // the key exists in the target model
    if (relationMeta.keyTo && targetModelProperties[relationMeta.keyTo]) {
        // The explicit cast is needed because of a limitation of type inference
        keyTo = relationMeta.keyTo;
    }
    else {
        debug('Resolved model %s from given metadata: %o', targetModel.modelName, targetModel);
        keyTo = (0, lodash_1.camelCase)(sourceModel.modelName + '_id');
        const hasDefaultFkProperty = targetModelProperties[keyTo];
        if (!hasDefaultFkProperty) {
            const reason = `target model ${targetModel.name} is missing definition of foreign key ${keyTo}`;
            throw new errors_1.InvalidRelationError(reason, relationMeta);
        }
    }
    let polymorphic;
    if (relationMeta.polymorphic === undefined ||
        relationMeta.polymorphic === false ||
        !relationMeta.polymorphic) {
        const polymorphicFalse = false;
        polymorphic = polymorphicFalse;
    }
    else {
        if (relationMeta.polymorphic === true) {
            const polymorphicObject = {
                discriminator: (0, lodash_1.camelCase)(relationMeta.target().name + '_type'),
            };
            polymorphic = polymorphicObject;
        }
        else {
            const polymorphicObject = relationMeta.polymorphic;
            polymorphic = polymorphicObject;
        }
    }
    return Object.assign(relationMeta, {
        keyFrom: keyFrom,
        keyTo: keyTo,
        polymorphic: polymorphic,
    });
}
exports.resolveHasOneMetadata = resolveHasOneMetadata;
//# sourceMappingURL=has-one.helpers.js.map