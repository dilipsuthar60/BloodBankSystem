import { Model } from '@loopback/repository';
import { OpenAPIObject, ReferenceObject, ResponseObject, SchemaObject } from 'openapi3-ts';
export type OpenApiSpec = OpenAPIObject;
export * from 'openapi3-ts';
export declare const DEFAULT_OPENAPI_SPEC_INFO: {
    title: string;
    version: string;
};
/**
 * Create an empty OpenApiSpec object that's still a valid openapi document.
 *
 * @deprecated Use `OpenApiBuilder` from `openapi3-ts` instead.
 */
export declare function createEmptyApiSpec(): OpenApiSpec;
export interface TagsDecoratorMetadata {
    tags: string[];
}
export declare enum OperationVisibility {
    DOCUMENTED = "documented",
    UNDOCUMENTED = "undocumented"
}
export type ResponseModelOrSpec = typeof Model | SchemaObject | ResponseObject | ReferenceObject;
export interface ResponseDecoratorMetadataItem {
    responseCode: number;
    contentType: string;
    responseModelOrSpec: ResponseModelOrSpec;
    description: string;
}
export type ResponseDecoratorMetadata = ResponseDecoratorMetadataItem[];
