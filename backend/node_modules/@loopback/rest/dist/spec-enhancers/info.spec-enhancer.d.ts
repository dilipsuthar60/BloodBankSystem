import { ApplicationMetadata } from '@loopback/core';
import { OASEnhancer, OpenApiSpec } from '@loopback/openapi-v3';
/**
 * An OpenAPI spec enhancer to populate `info` with application metadata
 * (package.json).
 */
export declare class InfoSpecEnhancer implements OASEnhancer {
    readonly pkg?: ApplicationMetadata | undefined;
    name: string;
    constructor(pkg?: ApplicationMetadata | undefined);
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
    /**
     * Parse package.json
     * {@link https://docs.npmjs.com/files/package.json#people-fields-author-contributors | author}
     *
     * @param author - Author string or object from package.json
     */
    private static parseAuthor;
}
