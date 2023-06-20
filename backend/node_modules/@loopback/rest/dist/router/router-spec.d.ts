import { OpenApiSpec } from '@loopback/openapi-v3';
export type RouterSpec = Pick<OpenApiSpec, 'paths' | 'components' | 'tags'>;
export declare function assignRouterSpec(target: RouterSpec, additions: RouterSpec): void;
