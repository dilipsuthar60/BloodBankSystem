import { ResponseModelOrSpec } from '../types';
/**
 * Add response object to a path spec.
 * @param responseCode - The HTTP response code.
 * @param responseModelOrSpec - The corresponding response object. Or the model
 *        type used to generate the response object.
 *
 * @example
 * ```ts
 * class MyController {
 *   @get('/greet')
 *   @oas.response(200, SuccessModel)
 *   @oas.response(404, OneError, { $ref: '#/definition...'})
 *   @oas.response(403, SecondError, { schema: ... })
 *   greet() {
 *     return new SuccessModel({message: 'Hello, world'});
 *   }
 * }
 * ```
 */
export declare function response(responseCode: number, ...responseModelOrSpec: ResponseModelOrSpec[]): MethodDecorator;
export declare namespace response {
    /**
     * Decorate the response as a file
     *
     * @example
     * ```ts
     * import {oas, get, param} from '@loopback/openapi-v3';
     * import {RestBindings, Response} from '@loopback/rest';
     *
     * class MyController {
     *   @get('/files/{filename}')
     *   @oas.response.file('image/jpeg', 'image/png')
     *   download(
     *     @param.path.string('filename') fileName: string,
     *     @inject(RestBindings.Http.RESPONSE) response: Response,
     *   ) {
     *     // use response.download(...);
     *   }
     * }
     * ```
     * @param mediaTypes - A list of media types for the file response. It's
     * default to `['application/octet-stream']`.
     */
    const file: (...mediaTypes: string[]) => MethodDecorator;
}
