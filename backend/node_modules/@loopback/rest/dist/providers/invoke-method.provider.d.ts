import { Context, Provider } from '@loopback/core';
import { Middleware } from '@loopback/express';
import { InvokeMethod } from '../types';
export declare class InvokeMethodProvider {
    static value(context: Context): InvokeMethod;
}
export declare class InvokeMethodMiddlewareProvider implements Provider<Middleware> {
    value(): Middleware;
}
