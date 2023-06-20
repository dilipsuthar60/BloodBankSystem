import { ReferenceObject, RequestBodyObject, SchemaObject, SchemasObject } from '@loopback/openapi-v3';
import { RequestBody } from '..';
import { ValidationOptions, ValueValidationOptions } from '../types';
/**
 * Check whether the request body is valid according to the provided OpenAPI schema.
 * The JSON schema is generated from the OpenAPI schema which is typically defined
 * by `@requestBody()`.
 * The validation leverages AJV schema validator.
 * @param body - The request body parsed from an HTTP request.
 * @param requestBodySpec - The OpenAPI requestBody specification defined in `@requestBody()`.
 * @param globalSchemas - The referenced schemas generated from `OpenAPISpec.components.schemas`.
 * @param options - Request body validation options for AJV
 */
export declare function validateRequestBody(body: RequestBody, requestBodySpec?: RequestBodyObject, globalSchemas?: SchemasObject, options?: ValidationOptions): Promise<void>;
/**
 * Validate the value against JSON schema.
 * @param value - The data value.
 * @param schema - The JSON schema used to perform the validation.
 * @param globalSchemas - Schema references.
 * @param options - Value validation options.
 */
export declare function validateValueAgainstSchema(value: any, schema: SchemaObject | ReferenceObject, globalSchemas?: SchemasObject, options?: ValueValidationOptions): Promise<any>;
