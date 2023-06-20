import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories';
import { Getter, HasManyDefinition, InclusionResolver } from '../relation.types';
/**
 * Creates InclusionResolver for HasManyThrough relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 *
 * @param meta - metadata of the hasMany relation (including through)
 * @param getThroughRepo - through repository getter i.e. where through
 * instances are
 * @param getTargetRepo - target repository getter i.e where target instances
 * are
 */
export declare function createHasManyThroughInclusionResolver<Through extends Entity, ThroughID, ThroughRelations extends object, Target extends Entity, TargetID, TargetRelations extends object>(meta: HasManyDefinition, getThroughRepo: Getter<EntityCrudRepository<Through, ThroughID, ThroughRelations>>, getTargetRepoDict: {
    [repoType: string]: Getter<EntityCrudRepository<Target, TargetID, TargetRelations>>;
}): InclusionResolver<Entity, Target>;
