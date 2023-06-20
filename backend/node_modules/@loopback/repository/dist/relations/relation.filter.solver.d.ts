import { Fields } from '@loopback/filter';
export declare function includeFieldIfNot<MT>(fields: Fields<MT> | undefined, fieldToInclude: Extract<keyof MT, string>): false | Fields<MT>;
