import { Application, Binding, Component, Constructor, ProviderMap, Server } from '@loopback/core';
import { RestServerConfig } from './rest.server';
export declare class RestComponent implements Component {
    providers: ProviderMap;
    /**
     * Add built-in body parsers
     */
    bindings: Binding[];
    servers: {
        [name: string]: Constructor<Server>;
    };
    constructor(app: Application, config?: RestComponentConfig);
}
export type RestComponentConfig = RestServerConfig;
