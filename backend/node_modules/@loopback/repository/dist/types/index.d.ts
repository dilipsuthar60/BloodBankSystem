/**
 * Built-in types for LoopBack modeling
 * - Type: abstract base type
 * - StringType: string
 * - BooleanType: boolean
 * - NumberType: number
 * - DateType: Date
 * - BufferType: Buffer
 * - AnyType: any
 * - ArrayType: Array<T>
 * - UnionType: Union of types
 */
import { AnyType } from './any';
import { ArrayType } from './array';
import { BooleanType } from './boolean';
import { BufferType } from './buffer';
import { DateType } from './date';
import { ModelType } from './model';
import { NullType } from './null';
import { NumberType } from './number';
import { ObjectType } from './object';
import { StringType } from './string';
import { Type } from './type';
import { UnionType } from './union';
export { Type, StringType, BooleanType, NumberType, DateType, BufferType, AnyType, ArrayType, UnionType, ModelType, NullType, ObjectType, };
export declare const STRING: StringType;
export declare const BOOLEAN: BooleanType;
export declare const NUMBER: NumberType;
export declare const DATE: DateType;
export declare const BUFFER: BufferType;
export declare const ANY: AnyType;
export declare const NULL: NullType;
