import { AjvFormat } from '../types';
/**
 * int32: [-2147483648, 21474836 47]
 */
export declare const int32Format: AjvFormat<number>;
/**
 * int64: [-9223372036854775808, 9223372036854775807]
 */
export declare const int64Format: AjvFormat<number>;
/**
 * float: [-2^128, 2^128]
 */
export declare const floatFormat: AjvFormat<number>;
/**
 * double: [-2^1024, 2^1024]
 */
export declare const doubleFormat: AjvFormat<number>;
/**
 * Base64 encoded string
 */
export declare const byteFormat: AjvFormat;
/**
 * Binary string
 */
export declare const binaryFormat: AjvFormat;
export declare const openapiFormats: (AjvFormat<string> | AjvFormat<number>)[];
