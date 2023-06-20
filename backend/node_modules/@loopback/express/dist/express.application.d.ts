import { Application, ApplicationConfig } from '@loopback/core';
import { ExpressServer } from './express.server';
/**
 * A LoopBack application with Express server
 */
export declare class ExpressApplication extends Application {
    readonly config?: ApplicationConfig | undefined;
    /**
     * Embedded Express Server
     */
    readonly expressServer: ExpressServer;
    constructor(config?: ApplicationConfig | undefined);
}
