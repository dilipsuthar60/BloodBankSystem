/// <reference types="express" />
import { Context } from '@loopback/core';
import { HandlerContext, MiddlewareContext, Request, Response } from '@loopback/express';
import { RestServerResolvedConfig } from './rest.server';
/**
 * A per-request Context combining an IoC container with handler context
 * (request, response, etc.).
 */
export declare class RequestContext extends MiddlewareContext implements HandlerContext {
    readonly request: Request;
    readonly response: Response;
    readonly serverConfig: RestServerResolvedConfig;
    /**
     * Get the protocol used by the client to make the request.
     * Please note this protocol may be different from what we are observing
     * at HTTP/TCP level, because reverse proxies like nginx or sidecars like
     * Envoy are switching between protocols.
     */
    get requestedProtocol(): string;
    /**
     * Get the effective base path of the incoming request. This base path
     * combines `baseUrl` provided by Express when LB4 handler is mounted on
     * a non-root path, with the `basePath` value configured at LB4 side.
     */
    get basePath(): string;
    /**
     * Get the base URL used by the client to make the request.
     * This URL contains the protocol, hostname, port and base path.
     * The path of the invoked route and query string is not included.
     *
     * Please note these values may be different from what we are observing
     * at HTTP/TCP level, because reverse proxies like nginx are rewriting them.
     */
    get requestedBaseUrl(): string;
    constructor(request: Request, response: Response, parent: Context, serverConfig: RestServerResolvedConfig, name?: string);
    protected setupBindings(): void;
}
