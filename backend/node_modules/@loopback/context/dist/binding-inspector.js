"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBindingFromClass = exports.DEFAULT_TYPE_NAMESPACES = exports.bindingTemplateFor = exports.removeNameAndKeyTags = exports.getBindingMetadata = exports.asBindingTemplate = exports.asClassOrProvider = exports.asProvider = exports.isProviderClass = exports.BINDING_METADATA_KEY = void 0;
const tslib_1 = require("tslib");
const metadata_1 = require("@loopback/metadata");
const debug_1 = tslib_1.__importDefault(require("debug"));
const binding_1 = require("./binding");
const keys_1 = require("./keys");
const debug = (0, debug_1.default)('loopback:context:binding-inspector');
/**
 * Metadata key for binding metadata
 */
exports.BINDING_METADATA_KEY = metadata_1.MetadataAccessor.create('binding.metadata');
/**
 * Check if a class implements `Provider` interface
 * @param cls - A class
 *
 * @typeParam T - Value type
 */
function isProviderClass(cls) {
    var _a;
    return (typeof cls === 'function' && typeof ((_a = cls.prototype) === null || _a === void 0 ? void 0 : _a.value) === 'function');
}
exports.isProviderClass = isProviderClass;
/**
 * A factory function to create a template function to bind the target class
 * as a `Provider`.
 * @param target - Target provider class
 *
 * @typeParam T - Value type
 */
function asProvider(target) {
    return function bindAsProvider(binding) {
        binding.toProvider(target).tag(keys_1.ContextTags.PROVIDER, {
            [keys_1.ContextTags.TYPE]: keys_1.ContextTags.PROVIDER,
        });
    };
}
exports.asProvider = asProvider;
/**
 * A factory function to create a template function to bind the target class
 * as a class or `Provider`.
 * @param target - Target class, which can be an implementation of `Provider`
 * or `DynamicValueProviderClass`
 *
 * @typeParam T - Value type
 */
function asClassOrProvider(target) {
    // Add a template to bind to a class or provider
    return function bindAsClassOrProvider(binding) {
        if (isProviderClass(target)) {
            asProvider(target)(binding);
        }
        else if ((0, binding_1.isDynamicValueProviderClass)(target)) {
            binding.toDynamicValue(target).tag(keys_1.ContextTags.DYNAMIC_VALUE_PROVIDER, {
                [keys_1.ContextTags.TYPE]: keys_1.ContextTags.DYNAMIC_VALUE_PROVIDER,
            });
        }
        else {
            binding.toClass(target);
        }
    };
}
exports.asClassOrProvider = asClassOrProvider;
/**
 * Convert binding scope and tags as a template function
 * @param scopeAndTags - Binding scope and tags
 *
 * @typeParam T - Value type
 */
function asBindingTemplate(scopeAndTags) {
    return function applyBindingScopeAndTag(binding) {
        if (scopeAndTags.scope) {
            binding.inScope(scopeAndTags.scope);
        }
        if (scopeAndTags.tags) {
            if (Array.isArray(scopeAndTags.tags)) {
                binding.tag(...scopeAndTags.tags);
            }
            else {
                binding.tag(scopeAndTags.tags);
            }
        }
    };
}
exports.asBindingTemplate = asBindingTemplate;
/**
 * Get binding metadata for a class
 * @param target - The target class
 *
 * @typeParam T - Value type
 */
function getBindingMetadata(target) {
    return metadata_1.MetadataInspector.getClassMetadata(exports.BINDING_METADATA_KEY, target);
}
exports.getBindingMetadata = getBindingMetadata;
/**
 * A binding template function to delete `name` and `key` tags
 */
function removeNameAndKeyTags(binding) {
    if (binding.tagMap) {
        delete binding.tagMap.name;
        delete binding.tagMap.key;
    }
}
exports.removeNameAndKeyTags = removeNameAndKeyTags;
/**
 * Get the binding template for a class with binding metadata
 *
 * @param cls - A class with optional `@injectable`
 *
 * @typeParam T - Value type
 */
function bindingTemplateFor(cls, options) {
    var _a;
    const spec = getBindingMetadata(cls);
    debug('class %s has binding metadata', cls.name, spec);
    const templateFunctions = (_a = spec === null || spec === void 0 ? void 0 : spec.templates) !== null && _a !== void 0 ? _a : [];
    if ((spec === null || spec === void 0 ? void 0 : spec.target) !== cls) {
        // Make sure the subclass is used as the binding source
        templateFunctions.push(asClassOrProvider(cls));
    }
    return function applyBindingTemplatesFromMetadata(binding) {
        for (const t of templateFunctions) {
            binding.apply(t);
        }
        if ((spec === null || spec === void 0 ? void 0 : spec.target) !== cls) {
            // Remove name/key tags inherited from base classes
            binding.apply(removeNameAndKeyTags);
        }
        if (options != null) {
            applyClassBindingOptions(binding, options);
        }
    };
}
exports.bindingTemplateFor = bindingTemplateFor;
exports.DEFAULT_TYPE_NAMESPACES = {
    class: 'classes',
    provider: 'providers',
    dynamicValueProvider: 'dynamicValueProviders',
};
/**
 * Create a binding from a class with decorated metadata. The class is attached
 * to the binding as follows:
 * - `binding.toClass(cls)`: if `cls` is a plain class such as `MyController`
 * - `binding.toProvider(cls)`: if `cls` is a value provider class with a
 * prototype method `value()`
 * - `binding.toDynamicValue(cls)`: if `cls` is a dynamic value provider class
 * with a static method `value()`
 *
 * @param cls - A class. It can be either a plain class, a value provider class,
 * or a dynamic value provider class
 * @param options - Options to customize the binding key
 *
 * @typeParam T - Value type
 */
function createBindingFromClass(cls, options = {}) {
    debug('create binding from class %s with options', cls.name, options);
    try {
        const templateFn = bindingTemplateFor(cls, options);
        const key = buildBindingKey(cls, options);
        const binding = binding_1.Binding.bind(key).apply(templateFn);
        return binding;
    }
    catch (err) {
        err.message += ` (while building binding for class ${cls.name})`;
        throw err;
    }
}
exports.createBindingFromClass = createBindingFromClass;
function applyClassBindingOptions(binding, options) {
    if (options.name) {
        binding.tag({ name: options.name });
    }
    if (options.type) {
        binding.tag({ type: options.type }, options.type);
    }
    if (options.defaultScope) {
        binding.applyDefaultScope(options.defaultScope);
    }
}
/**
 * Find/infer binding key namespace for a type
 * @param type - Artifact type, such as `controller`, `datasource`, or `server`
 * @param typeNamespaces - An object mapping type names to namespaces
 */
function getNamespace(type, typeNamespaces = exports.DEFAULT_TYPE_NAMESPACES) {
    if (type in typeNamespaces) {
        return typeNamespaces[type];
    }
    else {
        // Return the plural form
        return `${type}s`;
    }
}
/**
 * Build the binding key for a class with optional binding metadata.
 * The binding key is resolved in the following steps:
 *
 * 1. Check `options.key`, if it exists, return it
 * 2. Check if the binding metadata has `key` tag, if yes, return its tag value
 * 3. Identify `namespace` and `name` to form the binding key as
 * `<namespace>.<name>`.
 *   - namespace
 *     - `options.namespace`
 *     - `namespace` tag value
 *     - Map `options.type` or `type` tag value to a namespace, for example,
 *       'controller` to 'controller'.
 *   - name
 *     - `options.name`
 *     - `name` tag value
 *     - the class name
 *
 * @param cls - A class to be bound
 * @param options - Options to customize how to build the key
 *
 * @typeParam T - Value type
 */
function buildBindingKey(cls, options = {}) {
    var _a, _b, _c, _d, _e;
    if (options.key)
        return options.key;
    const templateFn = bindingTemplateFor(cls);
    // Create a temporary binding
    const bindingTemplate = new binding_1.Binding('template').apply(templateFn);
    // Is there a `key` tag?
    let key = bindingTemplate.tagMap[keys_1.ContextTags.KEY];
    if (key)
        return key;
    let namespace = (_b = (_a = options.namespace) !== null && _a !== void 0 ? _a : bindingTemplate.tagMap[keys_1.ContextTags.NAMESPACE]) !== null && _b !== void 0 ? _b : options.defaultNamespace;
    if (!namespace) {
        const namespaces = Object.assign({}, exports.DEFAULT_TYPE_NAMESPACES, options.typeNamespaceMapping);
        // Derive the key from type + name
        let type = (_c = options.type) !== null && _c !== void 0 ? _c : bindingTemplate.tagMap[keys_1.ContextTags.TYPE];
        if (!type) {
            type =
                (_d = bindingTemplate.tagNames.find(t => namespaces[t] != null)) !== null && _d !== void 0 ? _d : keys_1.ContextTags.CLASS;
        }
        namespace = getNamespace(type, namespaces);
    }
    const name = (_e = options.name) !== null && _e !== void 0 ? _e : (bindingTemplate.tagMap[keys_1.ContextTags.NAME] || cls.name);
    key = `${namespace}.${name}`;
    return key;
}
//# sourceMappingURL=binding-inspector.js.map