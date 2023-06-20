/**
 * Type definition for JSON types
 */
/**
 * JSON primitive types:
 * - string
 * - number
 * - boolean
 * - null
 */
export type JSONPrimitive = string | number | boolean | null;
/**
 * JSON values
 * - primitive
 * - object
 * - array
 */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
/**
 * JSON object
 */
export interface JSONObject extends Record<string, JSONValue> {
}
/**
 * JSON array
 */
export interface JSONArray extends Array<JSONValue> {
}
