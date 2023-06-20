/// <reference types="express" />
import { Context } from '@loopback/core';
import { ComponentsObject, ControllerSpec, PathObject, ReferenceObject, SchemaObject, SchemasObject } from '@loopback/openapi-v3';
import { RestServerResolvedConfig } from './rest.server';
import { ControllerClass, ControllerFactory, ResolvedRoute, RouteEntry, RoutingTable } from './router';
import { Request, Response } from './types';
export declare class HttpHandler {
    protected readonly _rootContext: Context;
    protected readonly _serverConfig: RestServerResolvedConfig;
    protected readonly _routes: RoutingTable;
    /**
     * Shared OpenAPI spec objects as `components`
     */
    protected _openApiComponents: ComponentsObject;
    handleRequest: (request: Request, response: Response) => Promise<void>;
    constructor(_rootContext: Context, _serverConfig: RestServerResolvedConfig, _routes?: RoutingTable);
    registerController<T extends object>(spec: ControllerSpec, controllerCtor: ControllerClass<T>, controllerFactory?: ControllerFactory<T>): void;
    registerRoute(route: RouteEntry): void;
    /**
     * @deprecated Use `registerApiComponents`
     * @param defs Schemas
     */
    registerApiDefinitions(defs: SchemasObject): void;
    /**
     * Merge components into the OpenApi spec
     * @param defs - Components
     */
    registerApiComponents(defs: ComponentsObject): void;
    getApiComponents(): ComponentsObject;
    /**
     * @deprecated Use `getApiComponents`
     */
    getApiDefinitions(): {
        [schema: string]: SchemaObject | ReferenceObject;
    } | undefined;
    describeApiPaths(): PathObject;
    findRoute(request: Request): ResolvedRoute;
    protected _handleRequest(request: Request, response: Response): Promise<void>;
}
