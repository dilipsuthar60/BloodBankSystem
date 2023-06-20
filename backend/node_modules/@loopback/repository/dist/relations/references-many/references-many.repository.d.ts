import { Getter } from '@loopback/core';
import { DataObject, Options } from '../../common-types';
import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
/**
 * CRUD operations for a target repository of a ReferencesMany relation
 */
export interface ReferencesManyRepository<Target extends Entity> {
    /**
     * Gets the target model instance
     * @param options
     * @returns A promise resolved with the target object or rejected
     * with an EntityNotFoundError when target model instance was not found.
     */
    get(options?: Options): Promise<Target>;
}
export declare class DefaultReferencesManyRepository<TargetEntity extends Entity, TargetIds, TargetRepository extends EntityCrudRepository<TargetEntity, TargetIds>> implements ReferencesManyRepository<TargetEntity> {
    getTargetRepository: Getter<TargetRepository>;
    constraint: DataObject<TargetEntity>;
    /**
     * Constructor of DefaultReferencesManyEntityCrudRepository
     * @param getTargetRepository - the getter of the related target model repository instance
     * @param constraint - the key value pair representing foreign key name to constrain
     * the target repository instance
     */
    constructor(getTargetRepository: Getter<TargetRepository>, constraint: DataObject<TargetEntity>);
    get(options?: Options): Promise<TargetEntity>;
}
