import { Getter } from '@loopback/core';
import { TypeResolver } from '../../';
import { DataObject, Options } from '../../common-types';
import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
/**
 * CRUD operations for a target repository of a BelongsTo relation
 */
export interface BelongsToRepository<Target extends Entity> {
    /**
     * Gets the target model instance
     * @param options
     * options.polymorphicType - a string or a string array of polymorphic type names
     * to specify which repositories should are expected to be searched
     * It is highly recommended to contain this param especially for
     * datasources using deplicated ids across tables
     * @returns A promise resolved with the target object or rejected
     * with an EntityNotFoundError when target model instance was not found.
     */
    get(options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<Target>;
}
export declare class DefaultBelongsToRepository<TargetEntity extends Entity, TargetId, TargetRepository extends EntityCrudRepository<TargetEntity, TargetId>> implements BelongsToRepository<TargetEntity> {
    getTargetRepository: Getter<TargetRepository> | {
        [repoType: string]: Getter<TargetRepository>;
    };
    constraint: DataObject<TargetEntity>;
    targetResolver: TypeResolver<Entity, typeof Entity>;
    /**
     * Constructor of DefaultBelongsToEntityCrudRepository
     * @param getTargetRepository - either a dictionary of target model type - target repository instance
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
    get(options?: Options & {
        polymorphicType?: string | string[];
    }): Promise<TargetEntity>;
}
