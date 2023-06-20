import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
import { BelongsToDefinition, Getter, InclusionResolver } from '../relation.types';
/**
 * Creates InclusionResolver for BelongsTo relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 * Notice: scope field for inclusion is not supported yet
 *
 * @param meta - resolved BelongsToMetadata
 * @param getTargetRepoDict - dictionary of target model type - target repository
 * i.e where related instances for different types are
 */
export declare function createBelongsToInclusionResolver<Target extends Entity, TargetID, TargetRelations extends object>(meta: BelongsToDefinition, getTargetRepoDict: {
    [repoType: string]: Getter<EntityCrudRepository<Target, TargetID, TargetRelations>>;
}): InclusionResolver<Entity, Target>;
