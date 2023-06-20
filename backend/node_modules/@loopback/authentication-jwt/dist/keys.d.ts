import { TokenService, UserService } from '@loopback/authentication';
import { BindingKey } from '@loopback/core';
import { User } from './models';
import { Credentials } from './services/user.service';
import { RefreshTokenService } from './types';
export declare namespace TokenServiceConstants {
    const TOKEN_SECRET_VALUE = "myjwts3cr3t";
    const TOKEN_EXPIRES_IN_VALUE = "21600";
}
export declare namespace TokenServiceBindings {
    const TOKEN_SECRET: BindingKey<string>;
    const TOKEN_EXPIRES_IN: BindingKey<string>;
    const TOKEN_SERVICE: BindingKey<TokenService>;
}
export declare namespace UserServiceBindings {
    const USER_SERVICE: BindingKey<UserService<User, Credentials>>;
    const DATASOURCE_NAME = "jwtdb";
    const USER_REPOSITORY = "repositories.UserRepository";
    const USER_CREDENTIALS_REPOSITORY = "repositories.UserCredentialsRepository";
}
/**
 * Constant values used when generating refresh token.
 */
export declare namespace RefreshTokenConstants {
    /**
     * The default secret used when generating refresh token.
     */
    const REFRESH_SECRET_VALUE = "r3fr35htok3n";
    /**
     * The default expiration time for refresh token.
     */
    const REFRESH_EXPIRES_IN_VALUE = "216000";
    /**
     * The default issuer used when generating refresh token.
     */
    const REFRESH_ISSUER_VALUE = "loopback4";
}
/**
 * Bindings related to token refresh service. The omitted explanation can be
 * found in namespace `RefreshTokenConstants`.
 */
export declare namespace RefreshTokenServiceBindings {
    const REFRESH_TOKEN_SERVICE: BindingKey<RefreshTokenService>;
    const REFRESH_SECRET: BindingKey<string>;
    const REFRESH_EXPIRES_IN: BindingKey<string>;
    const REFRESH_ISSUER: BindingKey<string>;
    /**
     * The backend datasource for refresh token's persistency.
     */
    const DATASOURCE_NAME = "refreshdb";
    /**
     * Key for the repository that stores the refresh token and its bound user
     * information
     */
    const REFRESH_REPOSITORY = "repositories.RefreshTokenRepository";
}
