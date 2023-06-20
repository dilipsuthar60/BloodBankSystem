/// <reference types="express" />
import { AuthenticationStrategy, TokenService } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy {
    tokenService: TokenService;
    name: string;
    constructor(tokenService: TokenService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): string;
}
