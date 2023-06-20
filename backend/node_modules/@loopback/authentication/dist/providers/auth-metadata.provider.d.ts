import { Constructor, Provider } from '@loopback/core';
import { AuthenticationMetadata, AuthenticationOptions } from '../types';
/**
 * Provides authentication metadata of a controller method
 * @example `context.bind('authentication.operationMetadata').toProvider(AuthMetadataProvider)`
 */
export declare class AuthMetadataProvider implements Provider<AuthenticationMetadata[] | undefined> {
    private readonly controllerClass;
    private readonly methodName;
    private readonly options;
    constructor(controllerClass: Constructor<{}>, methodName: string, options?: AuthenticationOptions);
    /**
     * @returns AuthenticationMetadata
     */
    value(): AuthenticationMetadata[] | undefined;
}
