import { AnyObject, DataObject, Options, PrototypeOf } from './common-types';
import { BelongsToDefinition, HasManyDefinition, HasOneDefinition, JsonSchema, ReferencesManyDefinition, RelationMetadata } from './index';
import { TypeResolver } from './type-resolver';
import { Type } from './types';
/**
 * This module defines the key classes representing building blocks for Domain
 * Driven Design.
 * See https://en.wikipedia.org/wiki/Domain-driven_design#Building_blocks
 */
export interface JsonSchemaWithExtensions extends JsonSchema {
    [attributes: string]: any;
}
export type PropertyType = string | Function | object | Type<any> | TypeResolver<Model>;
/**
 * Property definition for a model
 */
export interface PropertyDefinition {
    type: PropertyType;
    id?: boolean | number;
    /**
     * Used to hide this property from the response body,
     * adding this property to the hiddenProperties array
     */
    hidden?: boolean;
    json?: PropertyForm;
    jsonSchema?: JsonSchemaWithExtensions;
    store?: PropertyForm;
    itemType?: PropertyType;
    [attribute: string]: any;
}
/**
 * Defining the settings for a model
 * See https://loopback.io/doc/en/lb4/Model.html#supported-entries-of-model-definition
 */
export interface ModelSettings {
    /**
     * Description of the model
     */
    description?: string;
    /**
     * Prevent clients from setting the auto-generated ID value manually
     */
    forceId?: boolean;
    /**
     * Hides properties from response bodies
     */
    hiddenProperties?: string[];
    /**
     * Scope enables you to set a scope that will apply to every query made by the model's repository
     */
    scope?: object;
    /**
     * Specifies whether the model accepts only predefined properties or not
     */
    strict?: boolean | 'filter';
    [name: string]: any;
}
/**
 * See https://github.com/loopbackio/loopback-datasource-juggler/issues/432
 */
export interface PropertyForm {
    in?: boolean;
    out?: boolean;
    name?: string;
}
/**
 * A key-value map describing model relations.
 * A relation name is used as the key, a relation definition is the value.
 */
export type RelationDefinitionMap = {
    [relationName: string]: RelationMetadata;
};
/**
 * DSL for building a model definition.
 */
export interface ModelDefinitionSyntax {
    name: string;
    properties?: {
        [name: string]: PropertyDefinition | PropertyType;
    };
    settings?: ModelSettings;
    relations?: RelationDefinitionMap;
    jsonSchema?: JsonSchemaWithExtensions;
    [attribute: string]: any;
}
/**
 * Definition for a model
 */
export declare class ModelDefinition {
    readonly name: string;
    properties: {
        [name: string]: PropertyDefinition;
    };
    settings: ModelSettings;
    relations: RelationDefinitionMap;
    [attribute: string]: any;
    constructor(nameOrDef: string | ModelDefinitionSyntax);
    /**
     * Add a property
     * @param name - Property definition or name (string)
     * @param definitionOrType - Definition or property type
     */
    addProperty(name: string, definitionOrType: PropertyDefinition | PropertyType): this;
    /**
     * Add a setting
     * @param name - Setting name
     * @param value - Setting value
     */
    addSetting(name: string, value: any): this;
    /**
     * Define a new relation.
     * @param definition - The definition of the new relation.
     */
    addRelation(definition: RelationMetadata): this;
    /**
     * Define a new belongsTo relation.
     * @param name - The name of the belongsTo relation.
     * @param definition - The definition of the belongsTo relation.
     */
    belongsTo(name: string, definition: Omit<BelongsToDefinition, 'name' | 'type' | 'targetsMany'>): this;
    /**
     * Define a new hasOne relation.
     * @param name - The name of the hasOne relation.
     * @param definition - The definition of the hasOne relation.
     */
    hasOne(name: string, definition: Omit<HasOneDefinition, 'name' | 'type' | 'targetsMany'>): this;
    /**
     * Define a new hasMany relation.
     * @param name - The name of the hasMany relation.
     * @param definition - The definition of the hasMany relation.
     */
    hasMany(name: string, definition: Omit<HasManyDefinition, 'name' | 'type' | 'targetsMany'>): this;
    /**
     * Define a new referencesMany relation.
     * @param name - The name of the referencesMany relation.
     * @param definition - The definition of the referencesMany relation.
     */
    referencesMany(name: string, definition: Omit<ReferencesManyDefinition, 'name' | 'type' | 'targetsMany'>): this;
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
    idProperties(): string[];
}
/**
 * Base class for models
 */
export declare class Model {
    static get modelName(): string;
    static definition: ModelDefinition;
    /**
     * Serialize into a plain JSON object
     */
    toJSON(): Object;
    /**
     * Convert to a plain object as DTO
     *
     * If `ignoreUnknownProperty` is set to false, convert all properties in the
     * model instance, otherwise only convert the ones defined in the model
     * definitions.
     *
     * See function `asObject` for each property's conversion rules.
     */
    toObject(options?: Options): Object;
    constructor(data?: DataObject<Model>);
}
export interface Persistable {
}
/**
 * Base class for value objects - An object that contains attributes but has no
 * conceptual identity. They should be treated as immutable.
 */
export declare abstract class ValueObject extends Model implements Persistable {
}
/**
 * Base class for entities which have unique ids
 */
export declare class Entity extends Model implements Persistable {
    /**
     * Get the names of identity properties (primary keys).
     */
    static getIdProperties(): string[];
    /**
     * Get the identity value for a given entity instance or entity data object.
     *
     * @param entityOrData - The data object for which to determine the identity
     * value.
     */
    static getIdOf(entityOrData: AnyObject): any;
    /**
     * Get the identity value. If the identity is a composite key, returns
     * an object.
     */
    getId(): any;
    /**
     * Get the identity as an object, such as `{id: 1}` or
     * `{schoolId: 1, studentId: 2}`
     */
    getIdObject(): Object;
    /**
     * Build the where object for the given id
     * @param id - The id value
     */
    static buildWhereForId(id: any): any;
}
/**
 * Domain events
 */
export declare class Event {
    source: any;
    type: string;
}
export type EntityData = DataObject<Entity>;
export type EntityResolver<T extends Entity> = TypeResolver<T, typeof Entity>;
/**
 * Check model data for navigational properties linking to related models.
 * Throw a descriptive error if any such property is found.
 *
 * @param modelClass Model constructor, e.g. `Product`.
 * @param entityData  Model instance or a plain-data object,
 * e.g. `{name: 'pen'}`.
 */
export declare function rejectNavigationalPropertiesInData<M extends typeof Entity>(modelClass: M, data: DataObject<PrototypeOf<M>>): void;
