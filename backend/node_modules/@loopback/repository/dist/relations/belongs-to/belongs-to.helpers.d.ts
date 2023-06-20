import { BelongsToDefinition } from '../relation.types';
/**
 * Relation definition with optional metadata (e.g. `keyTo`) filled in.
 * @internal
 */
export type BelongsToResolvedDefinition = BelongsToDefinition & {
    keyFrom: string;
    keyTo: string;
    polymorphic: false | {
        discriminator: string;
    };
};
/**
 * Resolves given belongsTo metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * property id metadata
 * @param relationMeta - belongsTo metadata to resolve
 * @internal
 */
export declare function resolveBelongsToMetadata(relationMeta: BelongsToDefinition): BelongsToResolvedDefinition;
