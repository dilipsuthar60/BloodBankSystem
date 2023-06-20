"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.referencesMany = void 0;
const core_1 = require("@loopback/core");
const decorators_1 = require("../../decorators");
const relation_decorator_1 = require("../relation.decorator");
const relation_types_1 = require("../relation.types");
/**
 * Decorator for referencesMany
 * @param targetResolver - A resolver function that returns the target model for
 * a referencesMany relation
 * @param definition - Optional metadata for setting up a referencesMany relation
 * @param propertyDefinition - Optional metadata for setting up the property
 * @returns A property decorator
 */
function referencesMany(targetResolver, definition, propertyDefinition) {
    return function (decoratedTarget, decoratedKey) {
        var _a, _b, _c;
        const propType = (_a = core_1.MetadataInspector.getDesignTypeForProperty(decoratedTarget, decoratedKey)) !== null && _a !== void 0 ? _a : propertyDefinition === null || propertyDefinition === void 0 ? void 0 : propertyDefinition.type;
        if (!propType) {
            const fullPropName = core_1.DecoratorFactory.getTargetName(decoratedTarget, decoratedKey);
            throw new Error(`Cannot infer type of model property ${fullPropName} because ` +
                'TypeScript compiler option `emitDecoratorMetadata` is not set. ' +
                'Please enable `emitDecoratorMetadata` or use the third argument of ' +
                '`@referencesMany` decorator to specify the property type explicitly.');
        }
        const sourceKeyType = core_1.MetadataInspector.getDesignTypeForProperty(targetResolver().prototype, (_b = definition === null || definition === void 0 ? void 0 : definition.keyTo) !== null && _b !== void 0 ? _b : 'id');
        if (!sourceKeyType) {
            const fullPropName = core_1.DecoratorFactory.getTargetName(targetResolver().prototype, (_c = definition === null || definition === void 0 ? void 0 : definition.keyTo) !== null && _c !== void 0 ? _c : 'id');
            throw new Error(`Cannot infer type of model property ${fullPropName} because ` +
                'TypeScript compiler option `emitDecoratorMetadata` is not set. ' +
                'Please enable `emitDecoratorMetadata` or use the second argument of ' +
                '`@referencesMany` decorator to specify the property type explicitly.');
        }
        const propMeta = Object.assign({}, 
        // properties provided by the caller
        propertyDefinition, 
        // properties enforced by the decorator
        {
            type: propType,
            itemType: sourceKeyType,
            // TODO(bajtos) Make the foreign key required once our REST API layer
            // allows controller methods to exclude required properties
            // required: true,
        });
        (0, decorators_1.property)(propMeta)(decoratedTarget, decoratedKey);
        // @referencesMany() is typically decorating the foreign key property,
        // e.g. customerIds. We need to strip the trailing "Ids" suffix from the name.
        const relationName = decoratedKey.replace(/Ids$/, 's');
        const meta = Object.assign(
        // default values, can be customized by the caller
        {
            keyFrom: decoratedKey,
            name: relationName,
        }, 
        // properties provided by the caller
        definition, 
        // properties enforced by the decorator
        {
            type: relation_types_1.RelationType.referencesMany,
            targetsMany: true,
            source: decoratedTarget.constructor,
            target: targetResolver,
        });
        (0, relation_decorator_1.relation)(meta)(decoratedTarget, decoratedKey);
    };
}
exports.referencesMany = referencesMany;
//# sourceMappingURL=references-many.decorator.js.map