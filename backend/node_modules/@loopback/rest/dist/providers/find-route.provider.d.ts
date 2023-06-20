import { Context, Provider } from '@loopback/core';
import { Middleware } from '@loopback/express';
import { HttpHandler } from '../http-handler';
import { FindRoute } from '../types';
export declare class FindRouteProvider {
    static value(context: Context, handler: HttpHandler): FindRoute;
}
export declare class FindRouteMiddlewareProvider implements Provider<Middleware> {
    value(): Middleware;
}
