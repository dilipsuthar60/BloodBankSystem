import { BindingSpec } from './binding-inspector';
import { Constructor } from './value-promise';
/**
 * Decorate a class with binding configuration
 *
 * @example
 * ```ts
 * @injectable((binding) => {binding.inScope(BindingScope.SINGLETON).tag('controller')}
 * )
 * @injectable({scope: BindingScope.SINGLETON})
 * export class MyController {
 * }
 * ```
 *
 * @param specs - A list of binding scope/tags or template functions to
 * configure the binding
 */
export declare function injectable(...specs: BindingSpec[]): ClassDecorator;
/**
 * A namespace to host shortcuts for `@injectable`
 */
export declare namespace injectable {
    /**
     * `@injectable.provider` to denote a provider class
     *
     * A list of binding scope/tags or template functions to configure the binding
     */
    function provider(...specs: BindingSpec[]): (target: Constructor<unknown>) => void;
}
/**
 * `@bind` is now an alias to {@link injectable} for backward compatibility
 * {@inheritDoc injectable}
 */
export declare function bind(...specs: BindingSpec[]): ClassDecorator;
/**
 * Alias namespace `bind` to `injectable` for backward compatibility
 *
 * It should have the same members as `bind`.
 */
export declare namespace bind {
    /**
     * {@inheritDoc injectable.provider}
     */
    const provider: typeof injectable.provider;
}
