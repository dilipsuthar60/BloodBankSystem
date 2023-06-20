"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsTo = void 0;
const core_1 = require("@loopback/core");
const decorators_1 = require("../../decorators");
const relation_decorator_1 = require("../relation.decorator");
const relation_types_1 = require("../relation.types");
/**
 * Decorator for belongsTo
 * @param targetResolver - A resolver function that returns the target model for
 * a belongsTo relation
 * @param definition - Optional metadata for setting up a belongsTo relation
 * @param propertyDefinition - Optional metadata for setting up the property
 * @returns A property decorator
 */
function belongsTo(targetResolver, definition, propertyDefinition) {
    return function (decoratedTarget, decoratedKey) {
        var _a;
        const propType = (_a = core_1.MetadataInspector.getDesignTypeForProperty(decoratedTarget, decoratedKey)) !== null && _a !== void 0 ? _a : propertyDefinition === null || propertyDefinition === void 0 ? void 0 : propertyDefinition.type;
        if (!propType) {
            const fullPropName = core_1.DecoratorFactory.getTargetName(decoratedTarget, decoratedKey);
            throw new Error(`Cannot infer type of model property ${fullPropName} because ` +
                'TypeScript compiler option `emitDecoratorMetadata` is not set. ' +
                'Please enable `emitDecoratorMetadata` or use the third argument of ' +
                '`@belongsTo` decorator to specify the property type explicitly.');
        }
        const propMeta = Object.assign({}, 
        // properties provided by the caller
        propertyDefinition, 
        // properties enforced by the decorator
        {
            type: propType,
            // TODO(bajtos) Make the foreign key required once our REST API layer
            // allows controller methods to exclude required properties
            // required: true,
        });
        (0, decorators_1.property)(propMeta)(decoratedTarget, decoratedKey);
        // @belongsTo() is typically decorating the foreign key property,
        // e.g. customerId. We need to strip the trailing "Id" suffix from the name.
        const relationName = decoratedKey.replace(/Id$/, '');
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
            type: relation_types_1.RelationType.belongsTo,
            targetsMany: false,
            source: decoratedTarget.constructor,
            target: targetResolver,
        });
        (0, relation_decorator_1.relation)(meta)(decoratedTarget, decoratedKey);
    };
}
exports.belongsTo = belongsTo;
//# sourceMappingURL=belongs-to.decorator.js.map