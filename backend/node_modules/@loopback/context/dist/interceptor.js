"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInterceptor = exports.invokeMethodWithInterceptors = exports.intercept = exports.INTERCEPT_CLASS_KEY = exports.mergeInterceptors = exports.INTERCEPT_METHOD_KEY = exports.globalInterceptor = exports.asGlobalInterceptor = exports.InterceptedInvocationContext = void 0;
const tslib_1 = require("tslib");
const metadata_1 = require("@loopback/metadata");
const assert_1 = tslib_1.__importDefault(require("assert"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const binding_decorator_1 = require("./binding-decorator");
const binding_inspector_1 = require("./binding-inspector");
const binding_key_1 = require("./binding-key");
const binding_sorter_1 = require("./binding-sorter");
const interceptor_chain_1 = require("./interceptor-chain");
const invocation_1 = require("./invocation");
const keys_1 = require("./keys");
const value_promise_1 = require("./value-promise");
const debug = (0, debug_1.default)('loopback:context:interceptor');
/**
 * A specialized InvocationContext for interceptors
 */
class InterceptedInvocationContext extends invocation_1.InvocationContext {
    /**
     * Discover all binding keys for global interceptors (tagged by
     * ContextTags.GLOBAL_INTERCEPTOR)
     */
    getGlobalInterceptorBindingKeys() {
        let bindings = this.findByTag(keys_1.ContextTags.GLOBAL_INTERCEPTOR);
        bindings = bindings.filter(binding => 
        // Only include interceptors that match the source type of the invocation
        this.applicableTo(binding));
        this.sortGlobalInterceptorBindings(bindings);
        const keys = bindings.map(b => b.key);
        debug('Global interceptor binding keys:', keys);
        return keys;
    }
    /**
     * Check if the binding for a global interceptor matches the source type
     * of the invocation
     * @param binding - Binding
     */
    applicableTo(binding) {
        var _a;
        const sourceType = (_a = this.source) === null || _a === void 0 ? void 0 : _a.type;
        // Unknown source type, always apply
        if (sourceType == null)
            return true;
        const allowedSource = binding.tagMap[keys_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE];
        return (
        // No tag, always apply
        allowedSource == null ||
            // source matched
            allowedSource === sourceType ||
            // source included in the string[]
            (Array.isArray(allowedSource) && allowedSource.includes(sourceType)));
    }
    /**
     * Sort global interceptor bindings by `globalInterceptorGroup` tags
     * @param bindings - An array of global interceptor bindings
     */
    sortGlobalInterceptorBindings(bindings) {
        var _a;
        // Get predefined ordered groups for global interceptors
        const orderedGroups = (_a = this.getSync(keys_1.ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS, {
            optional: true,
        })) !== null && _a !== void 0 ? _a : [];
        return (0, binding_sorter_1.sortBindingsByPhase)(bindings, keys_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP, orderedGroups);
    }
    /**
     * Load all interceptors for the given invocation context. It adds
     * interceptors from possibly three sources:
     * 1. method level `@intercept`
     * 2. class level `@intercept`
     * 3. global interceptors discovered in the context
     */
    loadInterceptors() {
        var _a, _b;
        let interceptors = (_a = metadata_1.MetadataInspector.getMethodMetadata(exports.INTERCEPT_METHOD_KEY, this.target, this.methodName)) !== null && _a !== void 0 ? _a : [];
        const targetClass = typeof this.target === 'function' ? this.target : this.target.constructor;
        const classInterceptors = (_b = metadata_1.MetadataInspector.getClassMetadata(exports.INTERCEPT_CLASS_KEY, targetClass)) !== null && _b !== void 0 ? _b : [];
        // Inserting class level interceptors before method level ones
        interceptors = mergeInterceptors(classInterceptors, interceptors);
        const globalInterceptors = this.getGlobalInterceptorBindingKeys();
        // Inserting global interceptors
        interceptors = mergeInterceptors(globalInterceptors, interceptors);
        debug('Interceptors for %s', this.targetName, interceptors);
        return interceptors;
    }
}
exports.InterceptedInvocationContext = InterceptedInvocationContext;
/**
 * The `BindingTemplate` function to configure a binding as a global interceptor
 * by tagging it with `ContextTags.INTERCEPTOR`
 * @param group - Group for ordering the interceptor
 */
function asGlobalInterceptor(group) {
    return binding => {
        binding
            // Tagging with `GLOBAL_INTERCEPTOR` is required.
            .tag(keys_1.ContextTags.GLOBAL_INTERCEPTOR)
            // `GLOBAL_INTERCEPTOR_NAMESPACE` is to make the binding key more readable.
            .tag({ [keys_1.ContextTags.NAMESPACE]: keys_1.GLOBAL_INTERCEPTOR_NAMESPACE });
        if (group)
            binding.tag({ [keys_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: group });
    };
}
exports.asGlobalInterceptor = asGlobalInterceptor;
/**
 * `@globalInterceptor` decorator to mark the class as a global interceptor
 * @param group - Group for ordering the interceptor
 * @param specs - Extra binding specs
 */
function globalInterceptor(group, ...specs) {
    return (0, binding_decorator_1.injectable)(asGlobalInterceptor(group), ...specs);
}
exports.globalInterceptor = globalInterceptor;
/**
 * Metadata key for method-level interceptors
 */
exports.INTERCEPT_METHOD_KEY = metadata_1.MetadataAccessor.create('intercept:method');
/**
 * Adding interceptors from the spec to the front of existing ones. Duplicate
 * entries are eliminated from the spec side.
 *
 * For example:
 *
 * - [log] + [cache, log] => [cache, log]
 * - [log] + [log, cache] => [log, cache]
 * - [] + [cache, log] => [cache, log]
 * - [cache, log] + [] => [cache, log]
 * - [log] + [cache] => [log, cache]
 *
 * @param interceptorsFromSpec - Interceptors from `@intercept`
 * @param existingInterceptors - Interceptors already applied for the method
 */
function mergeInterceptors(interceptorsFromSpec, existingInterceptors) {
    const interceptorsToApply = new Set(interceptorsFromSpec);
    const appliedInterceptors = new Set(existingInterceptors);
    // Remove interceptors that already exist
    for (const i of interceptorsToApply) {
        if (appliedInterceptors.has(i)) {
            interceptorsToApply.delete(i);
        }
    }
    // Add existing interceptors after ones from the spec
    for (const i of appliedInterceptors) {
        interceptorsToApply.add(i);
    }
    return Array.from(interceptorsToApply);
}
exports.mergeInterceptors = mergeInterceptors;
/**
 * Metadata key for method-level interceptors
 */
exports.INTERCEPT_CLASS_KEY = metadata_1.MetadataAccessor.create('intercept:class');
/**
 * A factory to define `@intercept` for classes. It allows `@intercept` to be
 * used multiple times on the same class.
 */
class InterceptClassDecoratorFactory extends metadata_1.ClassDecoratorFactory {
    mergeWithOwn(ownMetadata, target) {
        ownMetadata = ownMetadata || [];
        return mergeInterceptors(this.spec, ownMetadata);
    }
}
/**
 * A factory to define `@intercept` for methods. It allows `@intercept` to be
 * used multiple times on the same method.
 */
class InterceptMethodDecoratorFactory extends metadata_1.MethodDecoratorFactory {
    mergeWithOwn(ownMetadata, target, methodName, methodDescriptor) {
        ownMetadata = ownMetadata || {};
        const interceptors = ownMetadata[methodName] || [];
        // Adding interceptors to the list
        ownMetadata[methodName] = mergeInterceptors(this.spec, interceptors);
        return ownMetadata;
    }
}
/**
 * Decorator function `@intercept` for classes/methods to apply interceptors. It
 * can be applied on a class and its public methods. Multiple occurrences of
 * `@intercept` are allowed on the same target class or method. The decorator
 * takes a list of `interceptor` functions or binding keys.
 *
 * @example
 * ```ts
 * @intercept(log, metrics)
 * class MyController {
 *   @intercept('caching-interceptor')
 *   @intercept('name-validation-interceptor')
 *   greet(name: string) {
 *     return `Hello, ${name}`;
 *   }
 * }
 * ```
 *
 * @param interceptorOrKeys - One or more interceptors or binding keys that are
 * resolved to be interceptors
 */
function intercept(...interceptorOrKeys) {
    return function interceptDecoratorForClassOrMethod(
    // Class or a prototype
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target, method, 
    // Use `any` to for `TypedPropertyDescriptor`
    // See https://github.com/loopbackio/loopback-next/pull/2704
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDescriptor) {
        if (method && methodDescriptor) {
            // Method
            return InterceptMethodDecoratorFactory.createDecorator(exports.INTERCEPT_METHOD_KEY, interceptorOrKeys, { decoratorName: '@intercept' })(target, method, methodDescriptor);
        }
        if (typeof target === 'function' && !method && !methodDescriptor) {
            // Class
            return InterceptClassDecoratorFactory.createDecorator(exports.INTERCEPT_CLASS_KEY, interceptorOrKeys, { decoratorName: '@intercept' })(target);
        }
        // Not on a class or method
        throw new Error('@intercept cannot be used on a property: ' +
            metadata_1.DecoratorFactory.getTargetName(target, method, methodDescriptor));
    };
}
exports.intercept = intercept;
/**
 * Invoke a method with the given context
 * @param context - Context object
 * @param target - Target class (for static methods) or object (for instance methods)
 * @param methodName - Method name
 * @param args - An array of argument values
 * @param options - Options for the invocation
 */
function invokeMethodWithInterceptors(context, target, methodName, args, options = {}) {
    // Do not allow `skipInterceptors` as it's against the function name
    // `invokeMethodWithInterceptors`
    (0, assert_1.default)(!options.skipInterceptors, 'skipInterceptors is not allowed');
    const invocationCtx = new InterceptedInvocationContext(context, target, methodName, args, options.source);
    invocationCtx.assertMethodExists();
    return (0, value_promise_1.tryWithFinally)(() => {
        const interceptors = invocationCtx.loadInterceptors();
        const targetMethodInvoker = () => invocationCtx.invokeTargetMethod(options);
        interceptors.push(targetMethodInvoker);
        return (0, interceptor_chain_1.invokeInterceptors)(invocationCtx, interceptors);
    }, () => invocationCtx.close());
}
exports.invokeMethodWithInterceptors = invokeMethodWithInterceptors;
/**
 * Register an interceptor function or provider class to the given context
 * @param ctx - Context object
 * @param interceptor - An interceptor function or provider class
 * @param options - Options for the interceptor binding
 */
function registerInterceptor(ctx, interceptor, options = {}) {
    var _a, _b, _c;
    let { global } = options;
    const { group, source } = options;
    if (group != null || source != null) {
        // If group or source is set, assuming global
        global = global !== false;
    }
    const namespace = ((_b = (_a = options.namespace) !== null && _a !== void 0 ? _a : options.defaultNamespace) !== null && _b !== void 0 ? _b : global)
        ? keys_1.GLOBAL_INTERCEPTOR_NAMESPACE
        : keys_1.LOCAL_INTERCEPTOR_NAMESPACE;
    let binding;
    if ((0, binding_inspector_1.isProviderClass)(interceptor)) {
        binding = (0, binding_inspector_1.createBindingFromClass)(interceptor, {
            defaultNamespace: namespace,
            ...options,
        });
        if (binding.tagMap[keys_1.ContextTags.GLOBAL_INTERCEPTOR]) {
            global = true;
        }
        ctx.add(binding);
    }
    else {
        let key = options.key;
        if (!key) {
            const name = (_c = options.name) !== null && _c !== void 0 ? _c : interceptor.name;
            if (!name) {
                key = binding_key_1.BindingKey.generate(namespace).key;
            }
            else {
                key = `${namespace}.${name}`;
            }
        }
        binding = ctx
            .bind(key)
            .to(interceptor);
    }
    if (global) {
        binding.apply(asGlobalInterceptor(group));
        if (source) {
            binding.tag({ [keys_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: source });
        }
    }
    return binding;
}
exports.registerInterceptor = registerInterceptor;
//# sourceMappingURL=interceptor.js.map