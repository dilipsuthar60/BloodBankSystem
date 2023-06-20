import { RestRouterOptions } from './rest-router';
import { ResolvedRoute, RouteEntry } from './route-entry';
import { BaseRouter } from './router-base';
/**
 * Router implementation based on trie
 */
export declare class TrieRouter extends BaseRouter {
    private trie;
    constructor(options?: RestRouterOptions);
    protected addRouteWithPathVars(route: RouteEntry): void;
    protected findRouteWithPathVars(verb: string, path: string): ResolvedRoute | undefined;
    protected listRoutesWithPathVars(): RouteEntry[];
}
