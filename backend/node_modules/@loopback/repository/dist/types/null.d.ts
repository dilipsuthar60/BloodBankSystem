import { Type } from './type';
/**
 * Null type
 */
export declare class NullType implements Type<null> {
    readonly name = "boolean";
    isInstance(value: any): boolean;
    defaultValue(): null;
    isCoercible(value: any): boolean;
    coerce(value: any): null;
    serialize(value: boolean | null | undefined): null;
}
