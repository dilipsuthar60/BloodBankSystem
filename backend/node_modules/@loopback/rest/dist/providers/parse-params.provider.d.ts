import { Provider } from '@loopback/core';
import { Middleware } from '@loopback/express';
import { RequestBodyParser } from '../body-parsers';
import { AjvFactory, ParseParams, ValidationOptions } from '../types';
/**
 * Provides the function for parsing args in requests at runtime.
 *
 * @returns The handler function that will parse request args.
 */
export declare class ParseParamsProvider {
    static value(requestBodyParser: RequestBodyParser, validationOptions: ValidationOptions | undefined, ajvFactory: AjvFactory): ParseParams;
}
export declare class ParseParamsMiddlewareProvider implements Provider<Middleware> {
    value(): Middleware;
}
