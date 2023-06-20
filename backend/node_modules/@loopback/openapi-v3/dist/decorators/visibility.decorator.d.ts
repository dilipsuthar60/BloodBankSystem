import { OperationVisibility } from '../types';
/**
 * Marks an api path with the specfied visibility.  When applied to a class,
 * this decorator marks all paths with the specified visibility.
 *
 * You can optionally mark all controllers in a class with
 * `@visibility('undocumented')`, but use `@visibility('documented')`
 * on a specific method to ensure it is not marked as `undocumented`.
 *
 * @param visibilityTyoe - The visbility of the api path on the OAS3 spec.
 *
 * @example
 * ```ts
 * @oas.visibility('undocumented')
 * class MyController {
 *   @get('/greet')
 *   async function greet() {
 *     return 'Hello, World!'
 *   }
 *
 *   @get('/greet-v2')
 *   @oas.deprecated('documented')
 *   async function greetV2() {
 *     return 'Hello, World!'
 *   }
 * }
 *
 * class MyOtherController {
 *   @get('/echo')
 *   async function echo() {
 *     return 'Echo!'
 *   }
 * }
 * ```
 */
export declare function visibility(visibilityType: OperationVisibility): (target: any, method?: string, methodDescriptor?: TypedPropertyDescriptor<any>) => any;
