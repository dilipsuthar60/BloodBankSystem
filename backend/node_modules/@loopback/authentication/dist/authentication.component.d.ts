import { Component } from '@loopback/core';
import { AuthenticateActionProvider, AuthenticationMiddlewareProvider, AuthenticationStrategyProvider, AuthMetadataProvider } from './providers';
export declare class AuthenticationComponent implements Component {
    providers: {
        [x: string]: typeof AuthenticateActionProvider | typeof AuthenticationMiddlewareProvider | typeof AuthMetadataProvider | typeof AuthenticationStrategyProvider;
    };
}
