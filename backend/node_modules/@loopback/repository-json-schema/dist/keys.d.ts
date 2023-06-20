import { MetadataAccessor } from '@loopback/core';
import { JsonSchema } from './index';
/**
 * Metadata key used to set or retrieve repository JSON Schema
 */
export declare const JSON_SCHEMA_KEY: MetadataAccessor<{
    [key: string]: JsonSchema;
}, ClassDecorator>;
