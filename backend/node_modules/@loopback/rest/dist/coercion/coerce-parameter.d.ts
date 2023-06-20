import { ParameterObject } from '@loopback/openapi-v3';
import { ValueValidationOptions } from '../';
/**
 * Coerce the http raw data to a JavaScript type data of a parameter
 * according to its OpenAPI schema specification.
 *
 * @param data - The raw data get from http request
 * @param schema - The parameter's schema defined in OpenAPI specification
 * @param options - The ajv validation options
 */
export declare function coerceParameter(data: string | undefined | object, spec: ParameterObject, options?: ValueValidationOptions): Promise<any>;
