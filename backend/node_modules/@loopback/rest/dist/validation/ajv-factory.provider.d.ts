import { Provider } from '@loopback/core';
import { AjvFactory, ValidationOptions } from '../types';
export declare const DEFAULT_AJV_VALIDATION_OPTIONS: ValidationOptions;
/**
 * A provider class that instantiate an AJV instance
 */
export declare class AjvFactoryProvider implements Provider<AjvFactory> {
    private options;
    constructor(options?: ValidationOptions);
    private keywords;
    private formats;
    value(): AjvFactory;
}
