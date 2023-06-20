import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
import { Getter, InclusionResolver, ReferencesManyDefinition } from '../relation.types';
/**
 * Creates InclusionResolver for ReferencesMany relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 * Notice: scope field for inclusion is not supported yet
 *
 * @param meta - resolved ReferencesManyMetadata
 * @param getTargetRepo - target repository i.e where related instances are
 */
export declare function createReferencesManyInclusionResolver<Target extends Entity, TargetIds, TargetRelations extends object>(meta: ReferencesManyDefinition, getTargetRepo: Getter<EntityCrudRepository<Target, TargetIds, TargetRelations>>): InclusionResolver<Entity, Target>;
