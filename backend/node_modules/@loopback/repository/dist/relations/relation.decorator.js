"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.referencesOne = exports.embedsMany = exports.embedsOne = exports.getModelRelations = exports.relation = exports.RELATIONS_KEY = void 0;
const core_1 = require("@loopback/core");
const decorators_1 = require("../decorators");
const relation_types_1 = require("./relation.types");
exports.RELATIONS_KEY = 'loopback:relations';
/**
 * Decorator for relations
 * @param definition
 * @returns A property decorator
 */
function relation(definition) {
    // Apply relation definition to the model class
    return core_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, definition, {
        decoratorName: '@relation',
    });
}
exports.relation = relation;
/**
 * Get metadata of all relations defined on a given model class.
 *
 * @param modelCtor - The model class (the constructor function).
 * @returns A map of relation definitions
 */
function getModelRelations(modelCtor) {
    // Build model definitions if `@model` is missing
    const modelDef = (0, decorators_1.buildModelDefinition)(modelCtor);
    return (modelDef === null || modelDef === void 0 ? void 0 : modelDef.relations) || {};
}
exports.getModelRelations = getModelRelations;
//
// placeholder decorators for relations that are not implemented yet
// TODO: move these decorators to per-relation subdirectories
//
/**
 * Decorator for embedsOne
 * @param definition
 * @returns A property decorator
 */
function embedsOne(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.embedsOne }, definition);
    return core_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@embedsOne',
    });
}
exports.embedsOne = embedsOne;
/**
 * Decorator for embedsMany
 * @param definition
 * @returns A property decorator
 */
function embedsMany(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.embedsMany }, definition);
    return core_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@embedsMany',
    });
}
exports.embedsMany = embedsMany;
/**
 * Decorator for referencesOne
 * @param definition
 * @returns A property decorator
 */
function referencesOne(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.referencesOne }, definition);
    return core_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@referencesOne',
    });
}
exports.referencesOne = referencesOne;
//# sourceMappingURL=relation.decorator.js.map