import { ApplicationConfig } from '@loopback/core';
import { OASEnhancer, OpenApiSpec } from '@loopback/openapi-v3';
/**
 * This enhancer consolidates schemas into `/components/schemas` and replaces
 * instances of said schema with a $ref pointer.
 *
 * Please note that the title property must be set on a schema in order to be
 * considered for consolidation.
 *
 * For example, with the following schema instance:
 *
 * ```json
 * schema: {
 *   title: 'loopback.example',
 *   properties: {
 *     test: {
 *       type: 'string',
 *     },
 *   },
 * }
 * ```
 *
 * The consolidator will copy the schema body to
 * `/components/schemas/loopback.example` and replace any instance of the schema
 * with a reference to the component schema as follows:
 *
 * ```json
 * schema: {
 *   $ref: '#/components/schemas/loopback.example',
 * }
 * ```
 *
 * When comparing schemas to avoid naming collisions, the description field
 * is ignored.
 */
export declare class ConsolidationEnhancer implements OASEnhancer {
    readonly config?: ApplicationConfig | undefined;
    name: string;
    disabled: boolean;
    constructor(config?: ApplicationConfig | undefined);
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
    /**
     * Recursively search OpenApiSpec PathsObject for SchemaObjects with title
     * property. Moves reusable schema bodies to #/components/schemas and replace
     * with json pointer. It handles title collisions with schema body comparision.
     */
    private consolidateSchemaObjects;
    private recursiveWalk;
    /**
     * Carry out schema consolidation after tree traversal. If 'title' property
     * set then we consider current schema for consolidation. SchemaObjects with
     * properties (and title set) are moved to #/components/schemas/<title> and
     * replaced with ReferenceObject.
     *
     * Features:
     *  - name collision protection
     *
     * @param schema - current schema element to process
     * @param parentPath - path object to parent
     * @param spec - subject OpenApi specification
     */
    private processSchema;
    private getRefSchema;
    private patchRef;
    private patchPath;
    private ifConsolidationCandidate;
    private isTraversable;
}
