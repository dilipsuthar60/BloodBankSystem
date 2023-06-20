import { ReferencesManyDefinition } from '../relation.types';
/**
 * Relation definition with optional metadata (e.g. `keyTo`) filled in.
 * @internal
 */
export type ReferencesManyResolvedDefinition = ReferencesManyDefinition & {
    keyFrom: string;
    keyTo: string;
};
/**
 * Resolves given referencesMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * property id metadata
 * @param relationMeta - referencesMany metadata to resolve
 * @internal
 */
export declare function resolveReferencesManyMetadata(relationMeta: ReferencesManyDefinition): ReferencesManyResolvedDefinition;
