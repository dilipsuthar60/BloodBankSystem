"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.property = exports.buildModelDefinition = exports.model = exports.MODEL_WITH_PROPERTIES_KEY = exports.MODEL_PROPERTIES_KEY = exports.MODEL_KEY = void 0;
const core_1 = require("@loopback/core");
const model_1 = require("../model");
const relation_decorator_1 = require("../relations/relation.decorator");
exports.MODEL_KEY = core_1.MetadataAccessor.create('loopback:model');
exports.MODEL_PROPERTIES_KEY = core_1.MetadataAccessor.create('loopback:model-properties');
exports.MODEL_WITH_PROPERTIES_KEY = core_1.MetadataAccessor.create('loopback:model-and-properties');
/**
 * Decorator for model definitions
 * @param definition
 * @returns A class decorator for `model`
 */
function model(definition) {
    return function (target) {
        var _a;
        definition = definition !== null && definition !== void 0 ? definition : {};
        const def = Object.assign(definition, {
            name: (_a = definition.name) !== null && _a !== void 0 ? _a : target.name,
        });
        const decorator = core_1.ClassDecoratorFactory.createDecorator(exports.MODEL_KEY, definition, { decoratorName: '@model' });
        decorator(target);
        // Build "ModelDefinition" and store it on model constructor
        buildModelDefinition(target, def);
    };
}
exports.model = model;
/**
 * Build model definition from decorations
 * @param target - Target model class
 * @param def - Model definition spec
 */
function buildModelDefinition(target, def) {
    var _a, _b, _c, _d;
    // Check if the definition for this class has been built (not from the super
    // class)
    const baseClass = Object.getPrototypeOf(target);
    if (!def &&
        target.definition &&
        baseClass &&
        target.definition !== baseClass.definition) {
        return target.definition;
    }
    const modelDef = new model_1.ModelDefinition(def !== null && def !== void 0 ? def : { name: target.name });
    const prototype = target.prototype;
    const propertyMap = (_a = core_1.MetadataInspector.getAllPropertyMetadata(exports.MODEL_PROPERTIES_KEY, prototype)) !== null && _a !== void 0 ? _a : {};
    for (const [propName, propDef] of Object.entries(propertyMap)) {
        const designType = (_b = propDef.type) !== null && _b !== void 0 ? _b : core_1.MetadataInspector.getDesignTypeForProperty(prototype, propName);
        if (!designType) {
            const err = new Error(`The definition of model property ${modelDef.name}.${propName} is missing ` +
                '`type` field and TypeScript did not provide any design-time type. ' +
                'Learn more at https://loopback.io/doc/en/lb4/Error-codes.html#cannot_infer_property_type');
            err.code = 'CANNOT_INFER_PROPERTY_TYPE';
            throw err;
        }
        if (propDef.hidden) {
            modelDef.settings.hiddenProperties =
                (_c = modelDef.settings.hiddenProperties) !== null && _c !== void 0 ? _c : [];
            modelDef.settings.hiddenProperties.push(propName);
        }
        propDef.type = designType;
        modelDef.addProperty(propName, propDef);
    }
    target.definition = modelDef;
    const relationMeta = (_d = core_1.MetadataInspector.getAllPropertyMetadata(relation_decorator_1.RELATIONS_KEY, prototype)) !== null && _d !== void 0 ? _d : {};
    const relations = {};
    // Build an object keyed by relation names
    Object.values(relationMeta).forEach(r => {
        relations[r.name] = r;
    });
    target.definition.relations = relations;
    return modelDef;
}
exports.buildModelDefinition = buildModelDefinition;
/**
 * Decorator for model properties
 * @param definition
 * @returns A property decorator
 */
function property(definition) {
    return core_1.PropertyDecoratorFactory.createDecorator(exports.MODEL_PROPERTIES_KEY, Object.assign({}, definition), { decoratorName: '@property' });
}
exports.property = property;
(function (property) {
    property.ERR_PROP_NOT_ARRAY = '@property.array can only decorate array properties!';
    property.ERR_NO_ARGS = 'decorator received less than two parameters';
    /**
     *
     * @param itemType - The type of array items.
     * Examples: `number`, `Product`, `() => Order`.
     * @param definition - Optional PropertyDefinition object for additional
     * metadata
     */
    function array(itemType, definition) {
        return function (target, propertyName) {
            const propType = core_1.MetadataInspector.getDesignTypeForProperty(target, propertyName);
            if (propType !== Array) {
                throw new Error(property.ERR_PROP_NOT_ARRAY);
            }
            else {
                property(Object.assign({ type: Array, itemType }, definition))(target, propertyName);
            }
        };
    }
    property.array = array;
})(property = exports.property || (exports.property = {}));
//# sourceMappingURL=model.decorator.js.map