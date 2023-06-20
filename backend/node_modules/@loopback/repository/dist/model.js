"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectNavigationalPropertiesInData = exports.Event = exports.Entity = exports.ValueObject = exports.Model = exports.ModelDefinition = void 0;
const index_1 = require("./index");
/**
 * Definition for a model
 */
class ModelDefinition {
    constructor(nameOrDef) {
        if (typeof nameOrDef === 'string') {
            nameOrDef = { name: nameOrDef };
        }
        const { name, properties, settings, relations } = nameOrDef;
        this.name = name;
        this.properties = {};
        if (properties) {
            for (const p in properties) {
                this.addProperty(p, properties[p]);
            }
        }
        this.settings = settings !== null && settings !== void 0 ? settings : new Map();
        this.relations = relations !== null && relations !== void 0 ? relations : {};
    }
    /**
     * Add a property
     * @param name - Property definition or name (string)
     * @param definitionOrType - Definition or property type
     */
    addProperty(name, definitionOrType) {
        const definition = definitionOrType.type
            ? definitionOrType
            : { type: definitionOrType };
        if (definition.id === true &&
            definition.generated === true &&
            definition.type !== undefined &&
            definition.useDefaultIdType === undefined) {
            definition.useDefaultIdType = false;
        }
        this.properties[name] = definition;
        return this;
    }
    /**
     * Add a setting
     * @param name - Setting name
     * @param value - Setting value
     */
    addSetting(name, value) {
        this.settings[name] = value;
        return this;
    }
    /**
     * Define a new relation.
     * @param definition - The definition of the new relation.
     */
    addRelation(definition) {
        this.relations[definition.name] = definition;
        return this;
    }
    /**
     * Define a new belongsTo relation.
     * @param name - The name of the belongsTo relation.
     * @param definition - The definition of the belongsTo relation.
     */
    belongsTo(name, definition) {
        const meta = {
            ...definition,
            name,
            type: index_1.RelationType.belongsTo,
            targetsMany: false,
        };
        return this.addRelation(meta);
    }
    /**
     * Define a new hasOne relation.
     * @param name - The name of the hasOne relation.
     * @param definition - The definition of the hasOne relation.
     */
    hasOne(name, definition) {
        const meta = {
            ...definition,
            name,
            type: index_1.RelationType.hasOne,
            targetsMany: false,
        };
        return this.addRelation(meta);
    }
    /**
     * Define a new hasMany relation.
     * @param name - The name of the hasMany relation.
     * @param definition - The definition of the hasMany relation.
     */
    hasMany(name, definition) {
        const meta = {
            ...definition,
            name,
            type: index_1.RelationType.hasMany,
            targetsMany: true,
        };
        return this.addRelation(meta);
    }
    /**
     * Define a new referencesMany relation.
     * @param name - The name of the referencesMany relation.
     * @param definition - The definition of the referencesMany relation.
     */
    referencesMany(name, definition) {
        const meta = {
            ...definition,
            name,
            type: index_1.RelationType.referencesMany,
            targetsMany: true,
        };
        return this.addRelation(meta);
    }
    /**
     * Get an array of names of ID properties, which are specified in
     * the model settings or properties with `id` attribute.
     *
     * @example
     * ```ts
     * {
     *   settings: {
     *     id: ['id']
     *   }
     *   properties: {
     *     id: {
     *       type: 'string',
     *       id: true
     *     }
     *   }
     * }
     * ```
     */
    idProperties() {
        if (typeof this.settings.id === 'string') {
            return [this.settings.id];
        }
        else if (Array.isArray(this.settings.id)) {
            return this.settings.id;
        }
        const idProps = Object.keys(this.properties).filter(prop => this.properties[prop].id);
        return idProps;
    }
}
exports.ModelDefinition = ModelDefinition;
function asJSON(value) {
    if (value == null)
        return value;
    if (typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    // Handle arrays
    if (Array.isArray(value)) {
        return value.map(item => asJSON(item));
    }
    return value;
}
/**
 * Convert a value to a plain object as DTO.
 *
 * - The prototype of the value in primitive types are preserved,
 *   like `Date`, `ObjectId`.
 * - If the value is an instance of custom model, call `toObject` to convert.
 * - If the value is an array, convert each element recursively.
 *
 * @param value the value to convert
 * @param options the options
 */
function asObject(value, options) {
    if (value == null)
        return value;
    if (typeof value.toObject === 'function') {
        return value.toObject(options);
    }
    if (Array.isArray(value)) {
        return value.map(item => asObject(item, options));
    }
    return value;
}
/**
 * Base class for models
 */
class Model {
    static get modelName() {
        var _a;
        return ((_a = this.definition) === null || _a === void 0 ? void 0 : _a.name) || this.name;
    }
    /**
     * Serialize into a plain JSON object
     */
    toJSON() {
        const def = this.constructor.definition;
        if (def == null || def.settings.strict === false) {
            return this.toObject({ ignoreUnknownProperties: false });
        }
        const copyPropertyAsJson = (key) => {
            const val = asJSON(this[key]);
            if (val !== undefined) {
                json[key] = val;
            }
        };
        const json = {};
        const hiddenProperties = def.settings.hiddenProperties || [];
        for (const p in def.properties) {
            if (p in this && !hiddenProperties.includes(p)) {
                copyPropertyAsJson(p);
            }
        }
        for (const r in def.relations) {
            const relName = def.relations[r].name;
            if (relName in this) {
                copyPropertyAsJson(relName);
            }
        }
        return json;
    }
    /**
     * Convert to a plain object as DTO
     *
     * If `ignoreUnknownProperty` is set to false, convert all properties in the
     * model instance, otherwise only convert the ones defined in the model
     * definitions.
     *
     * See function `asObject` for each property's conversion rules.
     */
    toObject(options) {
        const def = this.constructor.definition;
        const obj = {};
        if ((options === null || options === void 0 ? void 0 : options.ignoreUnknownProperties) === false) {
            const hiddenProperties = (def === null || def === void 0 ? void 0 : def.settings.hiddenProperties) || [];
            for (const p in this) {
                if (!hiddenProperties.includes(p)) {
                    const val = this[p];
                    obj[p] = asObject(val, options);
                }
            }
            return obj;
        }
        if (def === null || def === void 0 ? void 0 : def.relations) {
            for (const r in def.relations) {
                const relName = def.relations[r].name;
                if (relName in this) {
                    obj[relName] = asObject(this[relName], {
                        ...options,
                        ignoreUnknownProperties: false,
                    });
                }
            }
        }
        const props = def.properties;
        const keys = Object.keys(props);
        for (const i in keys) {
            const propertyName = keys[i];
            const val = this[propertyName];
            if (val === undefined)
                continue;
            obj[propertyName] = asObject(val, options);
        }
        return obj;
    }
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Model = Model;
/**
 * Base class for value objects - An object that contains attributes but has no
 * conceptual identity. They should be treated as immutable.
 */
class ValueObject extends Model {
}
exports.ValueObject = ValueObject;
/**
 * Base class for entities which have unique ids
 */
class Entity extends Model {
    /**
     * Get the names of identity properties (primary keys).
     */
    static getIdProperties() {
        return this.definition.idProperties();
    }
    /**
     * Get the identity value for a given entity instance or entity data object.
     *
     * @param entityOrData - The data object for which to determine the identity
     * value.
     */
    static getIdOf(entityOrData) {
        if (typeof entityOrData.getId === 'function') {
            return entityOrData.getId();
        }
        const idName = this.getIdProperties()[0];
        return entityOrData[idName];
    }
    /**
     * Get the identity value. If the identity is a composite key, returns
     * an object.
     */
    getId() {
        const definition = this.constructor.definition;
        const idProps = definition.idProperties();
        if (idProps.length === 1) {
            return this[idProps[0]];
        }
        if (!idProps.length) {
            throw new Error(`Invalid Entity ${this.constructor.name}:` +
                'missing primary key (id) property');
        }
        return this.getIdObject();
    }
    /**
     * Get the identity as an object, such as `{id: 1}` or
     * `{schoolId: 1, studentId: 2}`
     */
    getIdObject() {
        const definition = this.constructor.definition;
        const idProps = definition.idProperties();
        const idObj = {};
        for (const idProp of idProps) {
            idObj[idProp] = this[idProp];
        }
        return idObj;
    }
    /**
     * Build the where object for the given id
     * @param id - The id value
     */
    static buildWhereForId(id) {
        const where = {};
        const idProps = this.definition.idProperties();
        if (idProps.length === 1) {
            where[idProps[0]] = id;
        }
        else {
            for (const idProp of idProps) {
                where[idProp] = id[idProp];
            }
        }
        return where;
    }
}
exports.Entity = Entity;
/**
 * Domain events
 */
class Event {
}
exports.Event = Event;
/**
 * Check model data for navigational properties linking to related models.
 * Throw a descriptive error if any such property is found.
 *
 * @param modelClass Model constructor, e.g. `Product`.
 * @param entityData  Model instance or a plain-data object,
 * e.g. `{name: 'pen'}`.
 */
function rejectNavigationalPropertiesInData(modelClass, data) {
    const def = modelClass.definition;
    const props = def.properties;
    for (const r in def.relations) {
        const relName = def.relations[r].name;
        if (!(relName in data))
            continue;
        let msg = 'Navigational properties are not allowed in model data ' +
            `(model "${modelClass.modelName}" property "${relName}"), ` +
            'please remove it.';
        if (relName in props) {
            msg +=
                ' The error might be invoked by belongsTo relations, please make' +
                    ' sure the relation name is not the same as the property name.';
        }
        throw new Error(msg);
    }
}
exports.rejectNavigationalPropertiesInData = rejectNavigationalPropertiesInData;
//# sourceMappingURL=model.js.map