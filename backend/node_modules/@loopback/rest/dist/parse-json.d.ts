/**
 * Factory to create a reviver function for `JSON.parse` to sanitize keys
 * @param reviver - Reviver function
 * @param prohibitedKeys - An array of keys to be rejected
 */
export declare function sanitizeJsonParse(reviver?: (key: any, value: any) => any, prohibitedKeys?: string[]): (key: string, value: any) => any;
/**
 * Parse a json string that rejects prohibited keys
 * @param text - JSON string
 * @param reviver - Optional reviver function for `JSON.parse`
 * @param prohibitedKeys - An array of keys to be rejected
 */
export declare function parseJson(text: string, reviver?: (key: any, value: any) => any, prohibitedKeys?: string[]): any;
