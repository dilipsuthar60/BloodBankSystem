import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories/repository';
import { Getter, InclusionResolver, ReferencesManyDefinition } from '../relation.types';
export interface ReferencesManyAccessor<Target extends Entity, SourceId> {
    /**
     * Invoke the function to obtain HasManyRepository.
     */
    (sourceId: SourceId): Promise<Target>;
    /**
     * Use `resolver` property to obtain an InclusionResolver for this relation.
     */
    inclusionResolver: InclusionResolver<Entity, Target>;
}
/**
 * Enforces a ReferencesMany constraint on a repository
 */
export declare function createReferencesManyAccessor<Target extends Entity, TargetIds, Source extends Entity, SourceId>(referencesManyMetadata: ReferencesManyDefinition, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetIds>>, sourceRepository: EntityCrudRepository<Source, SourceId>): ReferencesManyAccessor<Target, SourceId>;
