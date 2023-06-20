import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories/repository';
import { BelongsToDefinition, Getter, InclusionResolver } from '../relation.types';
export interface BelongsToAccessor<Target extends Entity, SourceId> {
    /**
     * Invoke the function to obtain HasManyRepository.
     */
    (sourceId: SourceId, polymorphicTypes?: string | string[]): Promise<Target>;
    /**
     * Use `resolver` property to obtain an InclusionResolver for this relation.
     */
    inclusionResolver: InclusionResolver<Entity, Target>;
}
/**
 * Enforces a BelongsTo constraint on a repository
 * If the target model is polymorphic, i.e. stored within different repositories,
 * supply the targetRepositoryGetter with a dictionary in the form of {[typeName: string]: repositoryGetter}
 */
export declare function createBelongsToAccessor<Target extends Entity, TargetId, Source extends Entity, SourceId>(belongsToMetadata: BelongsToDefinition, targetRepositoryGetter: Getter<EntityCrudRepository<Target, TargetId>> | {
    [repoType: string]: Getter<EntityCrudRepository<Target, TargetId>>;
}, sourceRepository: EntityCrudRepository<Source, SourceId>): BelongsToAccessor<Target, SourceId>;
