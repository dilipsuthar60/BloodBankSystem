"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.injectable = void 0;
const metadata_1 = require("@loopback/metadata");
const binding_inspector_1 = require("./binding-inspector");
/**
 * Decorator factory for `@injectable`
 */
class InjectableDecoratorFactory extends metadata_1.ClassDecoratorFactory {
    mergeWithInherited(inherited, target) {
        if (inherited) {
            return {
                templates: [
                    ...inherited.templates,
                    binding_inspector_1.removeNameAndKeyTags,
                    ...this.spec.templates,
                ],
                target: this.spec.target,
            };
        }
        else {
            this.withTarget(this.spec, target);
            return this.spec;
        }
    }
    mergeWithOwn(ownMetadata) {
        return {
            templates: [...ownMetadata.templates, ...this.spec.templates],
            target: this.spec.target,
        };
    }
    withTarget(spec, target) {
        spec.target = target;
        return spec;
    }
}
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
function injectable(...specs) {
    const templateFunctions = specs.map(t => {
        if (typeof t === 'function') {
            return t;
        }
        else {
            return (0, binding_inspector_1.asBindingTemplate)(t);
        }
    });
    return (target) => {
        const cls = target;
        const spec = {
            templates: [(0, binding_inspector_1.asClassOrProvider)(cls), ...templateFunctions],
            target: cls,
        };
        const decorator = InjectableDecoratorFactory.createDecorator(binding_inspector_1.BINDING_METADATA_KEY, spec, { decoratorName: '@injectable' });
        decorator(target);
    };
}
exports.injectable = injectable;
/**
 * A namespace to host shortcuts for `@injectable`
 */
(function (injectable) {
    /**
     * `@injectable.provider` to denote a provider class
     *
     * A list of binding scope/tags or template functions to configure the binding
     */
    function provider(...specs) {
        return (target) => {
            if (!(0, binding_inspector_1.isProviderClass)(target)) {
                throw new Error(`Target ${target} is not a Provider`);
            }
            injectable(
            // Set up the default for providers
            (0, binding_inspector_1.asProvider)(target), 
            // Call other template functions
            ...specs)(target);
        };
    }
    injectable.provider = provider;
})(injectable = exports.injectable || (exports.injectable = {}));
/**
 * `@bind` is now an alias to {@link injectable} for backward compatibility
 * {@inheritDoc injectable}
 */
function bind(...specs) {
    return injectable(...specs);
}
exports.bind = bind;
/**
 * Alias namespace `bind` to `injectable` for backward compatibility
 *
 * It should have the same members as `bind`.
 */
(function (bind) {
    /**
     * {@inheritDoc injectable.provider}
     */
    bind.provider = injectable.provider;
})(bind = exports.bind || (exports.bind = {}));
//# sourceMappingURL=binding-decorator.js.map