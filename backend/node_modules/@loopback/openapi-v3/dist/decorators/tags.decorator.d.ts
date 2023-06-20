/**
 * Add tags for an endpoint. When applied to a class, this decorator
 * adds the tags to all endpoints.
 *
 * @param tagNames - A list of tags for API documentation control. Tags can be
 *        used for logical grouping of operations by resources or any other
 *        qualifier.
 *
 * @example
 * ```ts
 * @oas.tags('greeting', 'public')
 * class MyController {
 *   @get('/greet')
 *   greet() {
 *     return 'Hello world!';
 *   }

 *   @get('/echo')
 *   echo() {
 *     return 'Hello world!';
 *   }
 * }
 * ```
 *
 * or
 *
 * ```ts
 * class MyController {
 *   @oas.tags('greeting', 'public')
 *   @get('/greet')
 *   greet() {
 *     return 'Hello world!';
 *   }

 *   @get('/echo')
 *   echo() {
 *     return 'Hello world!';
 *   }
 * }
 * ```
 */
export declare function tags(...tagNames: string[]): (target: any, method?: string, methodDescriptor?: TypedPropertyDescriptor<any>) => any;
