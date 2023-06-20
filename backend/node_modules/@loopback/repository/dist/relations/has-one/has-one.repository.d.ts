import { Getter } from '@loopback/core';
import { Filter } from '@loopback/filter';
import { TypeResolver } from '../../';
import { Count, DataObject, Options } from '../../common-types';
import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
/**
 * CRUD operations for a target repository of a HasMany relation
 */
export interface HasOneRepository<Target extends Entity> {
    /**
     * Create a target model instance
     * @param targetModelData - The target model data
     * @param options - Options for the operation
     * options.polymorphicType - If polymorphic target model,
     * specify of which concrete model the created instance should be
     * @returns A promise which resolves to the newly created target model instance
     */
    create(targetModelData: DataObject<Target>, options?: Options & {
        polymorphicType?: string;
    }): Promise<Target>;
    /**
     * Find the only target model instance that belongs to the declaring model.
     * @param filter - Query filter without a Where condition
     * @param options - Options for the operations
     * options.polymorphicType - a string or a string array of polymorphic type names
     * to specify which repositories should are expected to be searched
     * It is highly recommended to contain this param especially for
     * datasources using deplicated ids across tables
     * @returns A promise resolved with the target object or rejected
     * with an EntityNotFoundError when target model instance was not found.
     */
    get(filter?: Pick<Filter<Target>, Exclude<keyof Filter<Target>, 'where'>>, options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<Target>;
    /**
     * Delete the related target model instance
     * @param options
     * options.polymorphicType - a string or a string array of polymorphic type names
     * to specify which repositories should are expected to be searched
     * It is highly recommended to contain this param especially for
     * datasources using deplicated ids across tables
     * @returns A promise which resolves the deleted target model instances
     */
    delete(options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<Count>;
    /**
     * Patch the  related target model instance
     * @param dataObject - The target model fields and their new values to patch
     * If the target models are of different types, this should be a dictionary
     * @param options
     * options.isPolymorphic - whether dataObject is a dictionary
     * @returns A promise which resolves the patched target model instances
     */
    patch(dataObject: DataObject<Target> | {
        [polymorphicType: string]: DataObject<Target>;
    }, options?: Options & {
        isPolymorphic?: boolean;
    }): Promise<Count>;
}
export declare class DefaultHasOneRepository<TargetEntity extends Entity, TargetID, TargetRepository extends EntityCrudRepository<TargetEntity, TargetID>> implements HasOneRepository<TargetEntity> {
    getTargetRepository: Getter<TargetRepository> | {
        [repoType: string]: Getter<TargetRepository>;
    };
    constraint: DataObject<TargetEntity>;
    targetResolver: TypeResolver<Entity, typeof Entity>;
    /**
     * Constructor of DefaultHasOneEntityCrudRepository
     * @param getTargetRepository  - either a dictionary of target model type - target repository instance
     * or a single target repository instance
     * e.g. if the target is of a non-polymorphic type "Student", put the studentRepositoryGetterInstance
     * if the target is of a polymorphic type "Person" which can be either a "Student" or a "Teacher"
     * then put "{Student: studentRepositoryGetterInstance, Teacher: teacherRepositoryGetterInstance}"
     * @param constraint - the key value pair representing foreign key name to constrain
     * the target repository instance
     * @param targetResolver - () => Target to resolve the target class
     * e.g. if the target is of type "Student", then put "() => Student"
     */
    constructor(getTargetRepository: Getter<TargetRepository> | {
        [repoType: string]: Getter<TargetRepository>;
    }, constraint: DataObject<TargetEntity>, targetResolver: TypeResolver<Entity, typeof Entity>);
    getTargetRepositoryDict: {
        [repoType: string]: Getter<TargetRepository>;
    };
    create(targetModelData: DataObject<TargetEntity>, options?: Options & {
        polymorphicType?: string;
    }): Promise<TargetEntity>;
    get(filter?: Pick<Filter<TargetEntity>, Exclude<keyof Filter<TargetEntity>, 'where'>>, options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<TargetEntity>;
    delete(options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<Count>;
    patch(dataObject: DataObject<TargetEntity> | {
        [polymorphicType: string]: DataObject<TargetEntity>;
    }, options?: Options & {
        isPolymorphic?: boolean;
    }): Promise<Count>;
}
