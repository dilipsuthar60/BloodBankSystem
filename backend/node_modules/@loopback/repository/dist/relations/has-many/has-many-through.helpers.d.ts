import { DataObject, Entity, HasManyDefinition } from '../..';
export type HasManyThroughResolvedDefinition = HasManyDefinition & {
    keyTo: string;
    keyFrom: string;
    through: {
        keyTo: string;
        keyFrom: string;
        polymorphic: false | {
            discriminator: string;
        };
    };
};
/**
 * Creates target constraint based on through models
 * @param relationMeta - resolved hasManyThrough metadata
 * @param throughInstances - an array of through instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createTargetConstraintFromThrough(resolvedMetadata,[{
        id: 2,
        categoryId: 2,
        productId: 8,
      }]);
 * >>> {id: 8}
 * createTargetConstraintFromThrough(resolvedMetadata, [
      {
        id: 2,
        categoryId: 2,
        productId: 8,
      }, {
        id: 1,
        categoryId: 2,
        productId: 9,
      }
  ]);

  >>> {id: {inq: [9, 8]}}
 * ```
 */
export declare function createTargetConstraintFromThrough<Target extends Entity, Through extends Entity>(relationMeta: HasManyThroughResolvedDefinition, throughInstances: Through[]): DataObject<Target>;
/**
 * Returns an array of target fks of the given throughInstances.
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param throughInstances - an array of through instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * getTargetKeysFromThroughModels(resolvedMetadata,[{
        id: 2,
        categoryId: 2,
        productId: 8,
      }]);
 * >>> [8]
 * getTargetKeysFromThroughModels(resolvedMetadata, [
      {
        id: 2,
        categoryId: 2,
        productId: 8,
      }, {
        id: 1,
        categoryId: 2,
        productId: 9,
      }
  ]);
  >>> [8, 9]
 */
export declare function getTargetKeysFromThroughModels<Through extends Entity, TargetID>(relationMeta: HasManyThroughResolvedDefinition, throughInstances: Through[]): TargetID[];
/**
 * Creates through constraint based on the source key
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param fkValue - foreign key of the source instance
 * @internal
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createThroughConstraintFromSource(resolvedMetadata, 1);
 *
 * >>> {categoryId: 1}
 * ```
 */
export declare function createThroughConstraintFromSource<Through extends Entity, SourceID>(relationMeta: HasManyThroughResolvedDefinition, fkValue: SourceID): DataObject<Through>;
/**
 * Returns an array of target ids of the given target instances.
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param targetInstances - an array of target instances
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * getTargetKeysFromTargetModels(resolvedMetadata,[{
        id: 2,
        des: 'a target',
      }]);
 * >>> [2]
 * getTargetKeysFromTargetModels(resolvedMetadata, [
      {
        id: 2,
        des: 'a target',
      }, {
        id: 1,
        des: 'a target',
      }
  ]);
  >>> [2, 1]
 */
export declare function getTargetIdsFromTargetModels<Target extends Entity, TargetID>(relationMeta: HasManyThroughResolvedDefinition, targetInstances: Target[]): TargetID[];
/**
 * Creates through constraint based on the target foreign key
 *
 * @param relationMeta - resolved hasManyThrough metadata
 * @param fkValue an array of the target instance foreign keys
 * @internal
 *
 * @example
 * ```ts
 * const resolvedMetadata = {
 *  // .. other props
 *  keyFrom: 'id',
 *  keyTo: 'id',
 *  through: {
 *    model: () => CategoryProductLink,
 *    keyFrom: 'categoryId',
 *    keyTo: 'productId',
 *  },
 * };
 * createThroughConstraintFromTarget(resolvedMetadata, [3]);
 *
 * >>> {productId: 3}
 *
 * createThroughConstraintFromTarget(resolvedMetadata, [3,4]);
 *
 * >>> {productId: {inq:[3,4]}}
 */
export declare function createThroughConstraintFromTarget<Through extends Entity, TargetID>(relationMeta: HasManyThroughResolvedDefinition, fkValues: TargetID[]): DataObject<Through>;
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta - hasManyThrough metadata to resolve
 * @internal
 */
export declare function resolveHasManyThroughMetadata(relationMeta: HasManyDefinition): HasManyThroughResolvedDefinition;
