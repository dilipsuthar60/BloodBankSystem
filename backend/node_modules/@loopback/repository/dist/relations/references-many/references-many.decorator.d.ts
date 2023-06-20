import { Entity, EntityResolver, PropertyDefinition } from '../../model';
import { ReferencesManyDefinition } from '../relation.types';
/**
 * Decorator for referencesMany
 * @param targetResolver - A resolver function that returns the target model for
 * a referencesMany relation
 * @param definition - Optional metadata for setting up a referencesMany relation
 * @param propertyDefinition - Optional metadata for setting up the property
 * @returns A property decorator
 */
export declare function referencesMany<T extends Entity>(targetResolver: EntityResolver<T>, definition?: Partial<ReferencesManyDefinition>, propertyDefinition?: Partial<PropertyDefinition>): (decoratedTarget: Entity, decoratedKey: string) => void;
