import { Constructor } from '@loopback/core';
import { AuthenticationMetadata } from '../types';
/**
 * Mark a controller method as requiring authenticated user.
 *
 * @param strategies - The names of the authentication strategies to use
 * or authentication metadata objects.
 */
export declare function authenticate(...strategies: (string | AuthenticationMetadata)[]): (target: any, method?: string, methodDescriptor?: TypedPropertyDescriptor<any>) => any;
export declare namespace authenticate {
    /**
     * `@authenticate.skip()` - a sugar decorator to skip authentication
     */
    const skip: () => (target: any, method?: string | undefined, methodDescriptor?: TypedPropertyDescriptor<any> | undefined) => any;
}
/**
 * Fetch authentication metadata stored by `@authenticate` decorator.
 *
 * @param targetClass - Target controller
 * @param methodName - Target method
 */
export declare function getAuthenticateMetadata(targetClass: Constructor<{}>, methodName: string): AuthenticationMetadata[] | undefined;
