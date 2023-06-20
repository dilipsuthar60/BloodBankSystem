import { AnyObject, Command, NamedParameters, Options, PositionalParameters } from '../common-types';
import { Model } from '../model';
/**
 * Interfaces adopted by a {@link Connector}.
 *
 * @experimental
 */
export declare namespace ConnectorInterfaces {
    /**
     * Strong relation interfaces adopted by a {@link Connector}
     *
     * @experimental
     */
    const enum StrongRelation {
        BELONGS_TO = "strongBelongsTo",
        HAS_ONE = "strongHasOne",
        HAS_MANY = "strongHasMany",
        HAS_MANY_THROUGH = "strongHasManyThrough",
        HAS_AND_BELONGS_TO_MANY = "strongHasAndBelongsToMany",
        EMBEDS_ONE = "strongEmbedsOne",
        EMBEDS_MANY = "strongEmbedsMany",
        REFERNCES_MANY = "strongReferencesMany"
    }
    /**
     * Strong query join interfaces adopted by a {@link Connector}
     *
     * @experimental
     */
    const enum StrongJoins {
        INNER = "strongInnerJoin",
        LEFT = "strongLeftJoin",
        RIGHT = "strongRightJoin",
        FULL = "strongFullJoin",
        CARTESIAN = "strongCartesianJoin"
    }
}
/**
 * Common properties/operations for connectors
 */
export interface Connector {
    name: string;
    configModel?: Model;
    interfaces?: (string | ConnectorInterfaces.StrongRelation | ConnectorInterfaces.StrongJoins)[];
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    ping(): Promise<void>;
    execute?(command: Command, parameters: NamedParameters | PositionalParameters, options?: Options): Promise<AnyObject>;
}
