import { Getter, Provider } from '@loopback/core';
import { AuthenticationMetadata, AuthenticationStrategy } from '../types';
/**
 * An authentication strategy provider responsible for
 * resolving an authentication strategy by name.
 *
 * It declares an extension point to which all authentication strategy
 * implementations must register themselves as extensions.
 *
 * @example `context.bind('authentication.strategy').toProvider(AuthenticationStrategyProvider)`
 */
export declare class AuthenticationStrategyProvider implements Provider<AuthenticationStrategy[] | undefined> {
    protected authenticationStrategies: Getter<AuthenticationStrategy[]>;
    protected metadata?: AuthenticationMetadata[] | undefined;
    constructor(authenticationStrategies: Getter<AuthenticationStrategy[]>, metadata?: AuthenticationMetadata[] | undefined);
    value(): Promise<AuthenticationStrategy[] | undefined>;
    private findAuthenticationStrategies;
}
