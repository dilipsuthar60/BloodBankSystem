"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingCreationPolicy = exports.Context = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const binding_1 = require("./binding");
const binding_config_1 = require("./binding-config");
const binding_filter_1 = require("./binding-filter");
const binding_key_1 = require("./binding-key");
const context_subscription_1 = require("./context-subscription");
const context_tag_indexer_1 = require("./context-tag-indexer");
const context_view_1 = require("./context-view");
const keys_1 = require("./keys");
const resolution_session_1 = require("./resolution-session");
const unique_id_1 = require("./unique-id");
const value_promise_1 = require("./value-promise");
/**
 * Context provides an implementation of Inversion of Control (IoC) container
 */
class Context extends events_1.EventEmitter {
    /**
     * Create a new context.
     *
     * @example
     * ```ts
     * // Create a new root context, let the framework to create a unique name
     * const rootCtx = new Context();
     *
     * // Create a new child context inheriting bindings from `rootCtx`
     * const childCtx = new Context(rootCtx);
     *
     * // Create another root context called "application"
     * const appCtx = new Context('application');
     *
     * // Create a new child context called "request" and inheriting bindings
     * // from `appCtx`
     * const reqCtx = new Context(appCtx, 'request');
     * ```
     * @param _parent - The optional parent context
     * @param name - Name of the context. If not provided, a unique identifier
     * will be generated as the name.
     */
    constructor(_parent, name) {
        super();
        /**
         * Key to binding map as the internal registry
         */
        this.registry = new Map();
        /**
         * Scope for binding resolution
         */
        this.scope = binding_1.BindingScope.CONTEXT;
        // The number of listeners can grow with the number of child contexts
        // For example, each request can add a listener to the RestServer and the
        // listener is removed when the request processing is finished.
        // See https://github.com/loopbackio/loopback-next/issues/4363
        this.setMaxListeners(Infinity);
        if (typeof _parent === 'string') {
            name = _parent;
            _parent = undefined;
        }
        this._parent = _parent;
        this.name = name !== null && name !== void 0 ? name : this.generateName();
        this.tagIndexer = new context_tag_indexer_1.ContextTagIndexer(this);
        this.subscriptionManager = new context_subscription_1.ContextSubscriptionManager(this);
        this._debug = (0, debug_1.default)(this.getDebugNamespace());
    }
    /**
     * Get the debug namespace for the context class. Subclasses can override
     * this method to supply its own namespace.
     *
     * @example
     * ```ts
     * export class Application extends Context {
     *   super('application');
     * }
     *
     * protected getDebugNamespace() {
     *   return 'loopback:context:application';
     * }
     * ```
     */
    getDebugNamespace() {
        if (this.constructor === Context)
            return 'loopback:context';
        const name = this.constructor.name.toLowerCase();
        return `loopback:context:${name}`;
    }
    generateName() {
        const id = (0, unique_id_1.generateUniqueId)();
        if (this.constructor === Context)
            return id;
        return `${this.constructor.name}-${id}`;
    }
    /**
     * @internal
     * Getter for ContextSubscriptionManager
     */
    get parent() {
        return this._parent;
    }
    /**
     * Wrap the debug statement so that it always print out the context name
     * as the prefix
     * @param args - Arguments for the debug
     */
    debug(...args) {
        /* istanbul ignore if */
        if (!this._debug.enabled)
            return;
        const formatter = args.shift();
        if (typeof formatter === 'string') {
            this._debug(`[%s] ${formatter}`, this.name, ...args);
        }
        else {
            this._debug('[%s] ', this.name, formatter, ...args);
        }
    }
    /**
     * A strongly-typed method to emit context events
     * @param type Event type
     * @param event Context event
     */
    emitEvent(type, event) {
        this.emit(type, event);
    }
    /**
     * Emit an `error` event
     * @param err Error
     */
    emitError(err) {
        this.emit('error', err);
    }
    /**
     * Create a binding with the given key in the context. If a locked binding
     * already exists with the same key, an error will be thrown.
     *
     * @param key - Binding key
     */
    bind(key) {
        const binding = new binding_1.Binding(key.toString());
        this.add(binding);
        return binding;
    }
    /**
     * Add a binding to the context. If a locked binding already exists with the
     * same key, an error will be thrown.
     * @param binding - The configured binding to be added
     */
    add(binding) {
        const key = binding.key;
        this.debug('[%s] Adding binding: %s', key);
        let existingBinding;
        const keyExists = this.registry.has(key);
        if (keyExists) {
            existingBinding = this.registry.get(key);
            const bindingIsLocked = existingBinding === null || existingBinding === void 0 ? void 0 : existingBinding.isLocked;
            if (bindingIsLocked)
                throw new Error(`Cannot rebind key "${key}" to a locked binding`);
        }
        this.registry.set(key, binding);
        if (existingBinding !== binding) {
            if (existingBinding != null) {
                this.emitEvent('unbind', {
                    binding: existingBinding,
                    context: this,
                    type: 'unbind',
                });
            }
            this.emitEvent('bind', { binding, context: this, type: 'bind' });
        }
        return this;
    }
    /**
     * Create a corresponding binding for configuration of the target bound by
     * the given key in the context.
     *
     * For example, `ctx.configure('controllers.MyController').to({x: 1})` will
     * create binding `controllers.MyController:$config` with value `{x: 1}`.
     *
     * @param key - The key for the binding to be configured
     */
    configure(key = '') {
        const bindingForConfig = binding_1.Binding.configure(key);
        this.add(bindingForConfig);
        return bindingForConfig;
    }
    /**
     * Get the value or promise of configuration for a given binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `<config>.x.y`. If not set, the `<config>` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     * - optional: if not set or set to `true`, `undefined` will be returned if
     * no corresponding value is found. Otherwise, an error will be thrown.
     */
    getConfigAsValueOrPromise(key, propertyPath, resolutionOptions) {
        this.setupConfigurationResolverIfNeeded();
        return this.configResolver.getConfigAsValueOrPromise(key, propertyPath, resolutionOptions);
    }
    /**
     * Set up the configuration resolver if needed
     */
    setupConfigurationResolverIfNeeded() {
        if (!this.configResolver) {
            // First try the bound ConfigurationResolver to this context
            const configResolver = this.getSync(keys_1.ContextBindings.CONFIGURATION_RESOLVER, {
                optional: true,
            });
            if (configResolver) {
                this.debug('Custom ConfigurationResolver is loaded from %s.', keys_1.ContextBindings.CONFIGURATION_RESOLVER.toString());
                this.configResolver = configResolver;
            }
            else {
                // Fallback to DefaultConfigurationResolver
                this.debug('DefaultConfigurationResolver is used.');
                this.configResolver = new binding_config_1.DefaultConfigurationResolver(this);
            }
        }
        return this.configResolver;
    }
    /**
     * Resolve configuration for the binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `<config>.x.y`. If not set, the `<config>` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     */
    async getConfig(key, propertyPath, resolutionOptions) {
        return this.getConfigAsValueOrPromise(key, propertyPath, resolutionOptions);
    }
    /**
     * Resolve configuration synchronously for the binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `config.x.y`. If not set, the `config` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     */
    getConfigSync(key, propertyPath, resolutionOptions) {
        const valueOrPromise = this.getConfigAsValueOrPromise(key, propertyPath, resolutionOptions);
        if ((0, value_promise_1.isPromiseLike)(valueOrPromise)) {
            const prop = propertyPath ? ` property ${propertyPath}` : '';
            throw new Error(`Cannot get config${prop} for ${key} synchronously: the value is a promise`);
        }
        return valueOrPromise;
    }
    /**
     * Unbind a binding from the context. No parent contexts will be checked.
     *
     * @remarks
     * If you need to unbind a binding owned by a parent context, use the code
     * below:
     *
     * ```ts
     * const ownerCtx = ctx.getOwnerContext(key);
     * return ownerCtx != null && ownerCtx.unbind(key);
     * ```
     *
     * @param key - Binding key
     * @returns true if the binding key is found and removed from this context
     */
    unbind(key) {
        this.debug('Unbind %s', key);
        key = binding_key_1.BindingKey.validate(key);
        const binding = this.registry.get(key);
        // If not found, return `false`
        if (binding == null)
            return false;
        if (binding === null || binding === void 0 ? void 0 : binding.isLocked)
            throw new Error(`Cannot unbind key "${key}" of a locked binding`);
        this.registry.delete(key);
        this.emitEvent('unbind', { binding, context: this, type: 'unbind' });
        return true;
    }
    /**
     * Add a context event observer to the context
     * @param observer - Context observer instance or function
     */
    subscribe(observer) {
        return this.subscriptionManager.subscribe(observer);
    }
    /**
     * Remove the context event observer from the context
     * @param observer - Context event observer
     */
    unsubscribe(observer) {
        return this.subscriptionManager.unsubscribe(observer);
    }
    /**
     * Close the context: clear observers, stop notifications, and remove event
     * listeners from its parent context.
     *
     * @remarks
     * This method MUST be called to avoid memory leaks once a context object is
     * no longer needed and should be recycled. An example is the `RequestContext`,
     * which is created per request.
     */
    close() {
        this.debug('Closing context...');
        this.subscriptionManager.close();
        this.tagIndexer.close();
    }
    /**
     * Check if an observer is subscribed to this context
     * @param observer - Context observer
     */
    isSubscribed(observer) {
        return this.subscriptionManager.isSubscribed(observer);
    }
    /**
     * Create a view of the context chain with the given binding filter
     * @param filter - A function to match bindings
     * @param comparator - A function to sort matched bindings
     * @param options - Resolution options
     */
    createView(filter, comparator, options) {
        const view = new context_view_1.ContextView(this, filter, comparator, options);
        view.open();
        return view;
    }
    /**
     * Check if a binding exists with the given key in the local context without
     * delegating to the parent context
     * @param key - Binding key
     */
    contains(key) {
        key = binding_key_1.BindingKey.validate(key);
        return this.registry.has(key);
    }
    /**
     * Check if a key is bound in the context or its ancestors
     * @param key - Binding key
     */
    isBound(key) {
        if (this.contains(key))
            return true;
        if (this._parent) {
            return this._parent.isBound(key);
        }
        return false;
    }
    /**
     * Get the owning context for a binding or its key
     * @param keyOrBinding - Binding object or key
     */
    getOwnerContext(keyOrBinding) {
        let key;
        if (keyOrBinding instanceof binding_1.Binding) {
            key = keyOrBinding.key;
        }
        else {
            key = keyOrBinding;
        }
        if (this.contains(key)) {
            if (keyOrBinding instanceof binding_1.Binding) {
                // Check if the contained binding is the same
                if (this.registry.get(key.toString()) === keyOrBinding) {
                    return this;
                }
                return undefined;
            }
            return this;
        }
        if (this._parent) {
            return this._parent.getOwnerContext(key);
        }
        return undefined;
    }
    /**
     * Get the context matching the scope
     * @param scope - Binding scope
     */
    getScopedContext(scope) {
        if (this.scope === scope)
            return this;
        if (this._parent) {
            return this._parent.getScopedContext(scope);
        }
        return undefined;
    }
    /**
     * Locate the resolution context for the given binding. Only bindings in the
     * resolution context and its ancestors are visible as dependencies to resolve
     * the given binding
     * @param binding - Binding object
     */
    getResolutionContext(binding) {
        let resolutionCtx;
        switch (binding.scope) {
            case binding_1.BindingScope.SINGLETON:
                // Use the owner context
                return this.getOwnerContext(binding.key);
            case binding_1.BindingScope.TRANSIENT:
            case binding_1.BindingScope.CONTEXT:
                // Use the current context
                return this;
            case binding_1.BindingScope.REQUEST:
                resolutionCtx = this.getScopedContext(binding.scope);
                if (resolutionCtx != null) {
                    return resolutionCtx;
                }
                else {
                    // If no `REQUEST` scope exists in the chain, fall back to the current
                    // context
                    this.debug('No context is found for binding "%s (scope=%s)". Fall back to the current context.', binding.key, binding.scope);
                    return this;
                }
            default:
                // Use the scoped context
                return this.getScopedContext(binding.scope);
        }
    }
    /**
     * Check if this context is visible (same or ancestor) to the given one
     * @param ctx - Another context object
     */
    isVisibleTo(ctx) {
        let current = ctx;
        while (current != null) {
            if (current === this)
                return true;
            current = current._parent;
        }
        return false;
    }
    /**
     * Find bindings using a key pattern or filter function
     * @param pattern - A filter function, a regexp or a wildcard pattern with
     * optional `*` and `?`. Find returns such bindings where the key matches
     * the provided pattern.
     *
     * For a wildcard:
     * - `*` matches zero or more characters except `.` and `:`
     * - `?` matches exactly one character except `.` and `:`
     *
     * For a filter function:
     * - return `true` to include the binding in the results
     * - return `false` to exclude it.
     */
    find(pattern) {
        var _a;
        // Optimize if the binding filter is for tags
        if (typeof pattern === 'function' && (0, binding_filter_1.isBindingTagFilter)(pattern)) {
            return this._findByTagIndex(pattern.bindingTagPattern);
        }
        const bindings = [];
        const filter = (0, binding_filter_1.filterByKey)(pattern);
        for (const b of this.registry.values()) {
            if (filter(b))
                bindings.push(b);
        }
        const parentBindings = (_a = this._parent) === null || _a === void 0 ? void 0 : _a.find(filter);
        return this._mergeWithParent(bindings, parentBindings);
    }
    /**
     * Find bindings using the tag filter. If the filter matches one of the
     * binding tags, the binding is included.
     *
     * @param tagFilter - A filter for tags. It can be in one of the following
     * forms:
     * - A regular expression, such as `/controller/`
     * - A wildcard pattern string with optional `*` and `?`, such as `'con*'`
     *   For a wildcard:
     *   - `*` matches zero or more characters except `.` and `:`
     *   - `?` matches exactly one character except `.` and `:`
     * - An object containing tag name/value pairs, such as
     * `{name: 'my-controller'}`
     */
    findByTag(tagFilter) {
        return this.find((0, binding_filter_1.filterByTag)(tagFilter));
    }
    /**
     * Find bindings by tag leveraging indexes
     * @param tag - Tag name pattern or name/value pairs
     */
    _findByTagIndex(tag) {
        var _a;
        const currentBindings = this.tagIndexer.findByTagIndex(tag);
        const parentBindings = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._findByTagIndex(tag);
        return this._mergeWithParent(currentBindings, parentBindings);
    }
    _mergeWithParent(childList, parentList) {
        if (!parentList)
            return childList;
        const additions = parentList.filter(parentBinding => {
            // children bindings take precedence
            return !childList.some(childBinding => childBinding.key === parentBinding.key);
        });
        return childList.concat(additions);
    }
    // Implementation
    async get(keyWithPath, optionsOrSession) {
        this.debug('Resolving binding: %s', keyWithPath);
        return this.getValueOrPromise(keyWithPath, optionsOrSession);
    }
    // Implementation
    getSync(keyWithPath, optionsOrSession) {
        this.debug('Resolving binding synchronously: %s', keyWithPath);
        const valueOrPromise = this.getValueOrPromise(keyWithPath, optionsOrSession);
        if ((0, value_promise_1.isPromiseLike)(valueOrPromise)) {
            throw new Error(`Cannot get ${keyWithPath} synchronously: the value is a promise`);
        }
        return valueOrPromise;
    }
    getBinding(key, options) {
        key = binding_key_1.BindingKey.validate(key);
        const binding = this.registry.get(key);
        if (binding) {
            return binding;
        }
        if (this._parent) {
            return this._parent.getBinding(key, options);
        }
        if (options === null || options === void 0 ? void 0 : options.optional)
            return undefined;
        throw new Error(`The key '${key}' is not bound to any value in context ${this.name}`);
    }
    /**
     * Find or create a binding for the given key
     * @param key - Binding address
     * @param policy - Binding creation policy
     */
    findOrCreateBinding(key, policy) {
        let binding;
        if (policy === BindingCreationPolicy.ALWAYS_CREATE) {
            binding = this.bind(key);
        }
        else if (policy === BindingCreationPolicy.NEVER_CREATE) {
            binding = this.getBinding(key);
        }
        else if (this.isBound(key)) {
            // CREATE_IF_NOT_BOUND - the key is bound
            binding = this.getBinding(key);
        }
        else {
            // CREATE_IF_NOT_BOUND - the key is not bound
            binding = this.bind(key);
        }
        return binding;
    }
    /**
     * Get the value bound to the given key.
     *
     * This is an internal version that preserves the dual sync/async result
     * of `Binding#getValue()`. Users should use `get()` or `getSync()` instead.
     *
     * @example
     *
     * ```ts
     * // get the value bound to "application.instance"
     * ctx.getValueOrPromise<Application>('application.instance');
     *
     * // get "rest" property from the value bound to "config"
     * ctx.getValueOrPromise<RestComponentConfig>('config#rest');
     *
     * // get "a" property of "numbers" property from the value bound to "data"
     * ctx.bind('data').to({numbers: {a: 1, b: 2}, port: 3000});
     * ctx.getValueOrPromise<number>('data#numbers.a');
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param optionsOrSession - Options for resolution or a session
     * @returns The bound value or a promise of the bound value, depending
     *   on how the binding is configured.
     * @internal
     */
    getValueOrPromise(keyWithPath, optionsOrSession) {
        const { key, propertyPath } = binding_key_1.BindingKey.parseKeyWithPath(keyWithPath);
        const options = (0, resolution_session_1.asResolutionOptions)(optionsOrSession);
        const binding = this.getBinding(key, { optional: true });
        if (binding == null) {
            if (options.optional)
                return undefined;
            throw new resolution_session_1.ResolutionError(`The key '${key}' is not bound to any value in context ${this.name}`, {
                context: this,
                binding: binding_1.Binding.bind(key),
                options,
            });
        }
        const boundValue = binding.getValue(this, options);
        return propertyPath == null || propertyPath === ''
            ? boundValue
            : (0, value_promise_1.transformValueOrPromise)(boundValue, v => (0, value_promise_1.getDeepProperty)(v, propertyPath));
    }
    /**
     * Create a plain JSON object for the context
     */
    toJSON() {
        const bindings = {};
        for (const [k, v] of this.registry) {
            bindings[k] = v.toJSON();
        }
        return bindings;
    }
    /**
     * Inspect the context and dump out a JSON object representing the context
     * hierarchy
     * @param options - Options for inspect
     */
    // TODO(rfeng): Evaluate https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects
    inspect(options = {}) {
        return this._inspect(options, new ClassNameMap());
    }
    /**
     * Inspect the context hierarchy
     * @param options - Options for inspect
     * @param visitedClasses - A map to keep class to name so that we can have
     * different names for classes with colliding names. The situation can happen
     * when two classes with the same name are bound in different modules.
     */
    _inspect(options, visitedClasses) {
        var _a;
        options = {
            includeParent: true,
            includeInjections: false,
            ...options,
        };
        const bindings = {};
        for (const [k, v] of this.registry) {
            const ctor = (_a = v.valueConstructor) !== null && _a !== void 0 ? _a : v.providerConstructor;
            let name = undefined;
            if (ctor != null) {
                name = visitedClasses.visit(ctor);
            }
            bindings[k] = v.inspect(options);
            if (name != null) {
                const binding = bindings[k];
                if (v.valueConstructor) {
                    binding.valueConstructor = name;
                }
                else if (v.providerConstructor) {
                    binding.providerConstructor = name;
                }
            }
        }
        const json = {
            name: this.name,
            bindings,
        };
        if (!options.includeParent)
            return json;
        if (this._parent) {
            json.parent = this._parent._inspect(options, visitedClasses);
        }
        return json;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event, listener) {
        return super.on(event, listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.Context = Context;
/**
 * An internal utility class to handle class name conflicts
 */
class ClassNameMap {
    constructor() {
        this.classes = new Map();
        this.nameIndex = new Map();
    }
    visit(ctor) {
        let name = this.classes.get(ctor);
        if (name == null) {
            name = ctor.name;
            // Now check if the name collides with another class
            let index = this.nameIndex.get(name);
            if (typeof index === 'number') {
                // A conflict is found, mangle the name as `ClassName #1`
                this.nameIndex.set(name, ++index);
                name = `${name} #${index}`;
            }
            else {
                // The name is used for the 1st time
                this.nameIndex.set(name, 0);
            }
            this.classes.set(ctor, name);
        }
        return name;
    }
}
/**
 * Policy to control if a binding should be created for the context
 */
var BindingCreationPolicy;
(function (BindingCreationPolicy) {
    /**
     * Always create a binding with the key for the context
     */
    BindingCreationPolicy["ALWAYS_CREATE"] = "Always";
    /**
     * Never create a binding for the context. If the key is not bound in the
     * context, throw an error.
     */
    BindingCreationPolicy["NEVER_CREATE"] = "Never";
    /**
     * Create a binding if the key is not bound in the context. Otherwise, return
     * the existing binding.
     */
    BindingCreationPolicy["CREATE_IF_NOT_BOUND"] = "IfNotBound";
})(BindingCreationPolicy = exports.BindingCreationPolicy || (exports.BindingCreationPolicy = {}));
//# sourceMappingURL=context.js.map