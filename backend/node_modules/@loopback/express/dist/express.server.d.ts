import { Context, Server } from '@loopback/core';
import { HttpOptions, HttpServer, HttpsOptions } from '@loopback/http-server';
import express from 'express';
import { BaseMiddlewareRegistry } from './middleware-registry';
import { MiddlewareContext, Request } from './types';
/**
 * Configuration for a LoopBack based Express server
 */
export type ExpressServerConfig = (HttpOptions | HttpsOptions) & {
    /**
     * Base path to mount the LoopBack middleware chain
     */
    basePath?: string;
    /**
     * Express settings
     */
    settings?: Record<string, unknown>;
};
/**
 * An Express server that provides middleware composition and injection
 */
export declare class ExpressServer extends BaseMiddlewareRegistry implements Server {
    protected readonly config?: ExpressServerConfig | undefined;
    /**
     * Base path to mount middleware
     */
    readonly basePath: string;
    /**
     * Embedded Express application
     */
    readonly expressApp: express.Application;
    /**
     * HTTP/HTTPS server
     */
    protected httpServer: HttpServer;
    constructor(config?: ExpressServerConfig | undefined, parent?: Context);
    /**
     * Some of the methods below are copied from RestServer
     * TODO(rfeng): We might want to refactor some methods from RestServer into
     * the base ExpressServer.
     */
    get listening(): boolean;
    /**
     * The base url for the server, including the basePath if set. For example,
     * the value will be 'http://localhost:3000/api' if `basePath` is set to
     * '/api'.
     */
    get url(): string | undefined;
    /**
     * The root url for the server without the basePath. For example, the value
     * will be 'http://localhost:3000' regardless of the `basePath`.
     */
    get rootUrl(): string | undefined;
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Retrieve the middleware context from the request
     * @param request - Request object
     */
    getMiddlewareContext(request: Request): MiddlewareContext | undefined;
}
