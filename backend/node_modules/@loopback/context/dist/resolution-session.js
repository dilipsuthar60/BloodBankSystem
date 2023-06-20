"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionError = exports.asResolutionOptions = exports.ResolutionSession = void 0;
const tslib_1 = require("tslib");
const metadata_1 = require("@loopback/metadata");
const debug_1 = tslib_1.__importDefault(require("debug"));
const value_promise_1 = require("./value-promise");
const debugSession = (0, debug_1.default)('loopback:context:resolver:session');
const getTargetName = metadata_1.DecoratorFactory.getTargetName;
/**
 * Type guard for binding elements
 * @param element - A resolution element
 */
function isBinding(element) {
    return element != null && element.type === 'binding';
}
/**
 * Type guard for injection elements
 * @param element - A resolution element
 */
function isInjection(element) {
    return element != null && element.type === 'injection';
}
/**
 * Object to keep states for a session to resolve bindings and their
 * dependencies within a context
 */
class ResolutionSession {
    constructor() {
        /**
         * A stack of bindings for the current resolution session. It's used to track
         * the path of dependency resolution and detect circular dependencies.
         */
        this.stack = [];
    }
    /**
     * Fork the current session so that a new one with the same stack can be used
     * in parallel or future resolutions, such as multiple method arguments,
     * multiple properties, or a getter function
     * @param session - The current session
     */
    static fork(session) {
        if (session === undefined)
            return undefined;
        const copy = new ResolutionSession();
        copy.stack.push(...session.stack);
        return copy;
    }
    /**
     * Run the given action with the given binding and session
     * @param action - A function to do some work with the resolution session
     * @param binding - The current binding
     * @param session - The current resolution session
     */
    static runWithBinding(action, binding, session = new ResolutionSession()) {
        // Start to resolve a binding within the session
        session.pushBinding(binding);
        return (0, value_promise_1.tryWithFinally)(() => action(session), () => session.popBinding());
    }
    /**
     * Run the given action with the given injection and session
     * @param action - A function to do some work with the resolution session
     * @param binding - The current injection
     * @param session - The current resolution session
     */
    static runWithInjection(action, injection, session = new ResolutionSession()) {
        session.pushInjection(injection);
        return (0, value_promise_1.tryWithFinally)(() => action(session), () => session.popInjection());
    }
    /**
     * Describe the injection for debugging purpose
     * @param injection - Injection object
     */
    static describeInjection(injection) {
        const name = getTargetName(injection.target, injection.member, injection.methodDescriptorOrParameterIndex);
        return {
            targetName: name,
            bindingSelector: injection.bindingSelector,
            metadata: injection.metadata,
        };
    }
    /**
     * Push the injection onto the session
     * @param injection - Injection The current injection
     */
    pushInjection(injection) {
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Enter injection:', ResolutionSession.describeInjection(injection));
        }
        this.stack.push({ type: 'injection', value: injection });
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Resolution path:', this.getResolutionPath());
        }
    }
    /**
     * Pop the last injection
     */
    popInjection() {
        const top = this.stack.pop();
        if (!isInjection(top)) {
            throw new Error('The top element must be an injection');
        }
        const injection = top.value;
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Exit injection:', ResolutionSession.describeInjection(injection));
            debugSession('Resolution path:', this.getResolutionPath() || '<empty>');
        }
        return injection;
    }
    /**
     * Getter for the current injection
     */
    get currentInjection() {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const element = this.stack[i];
            if (isInjection(element))
                return element.value;
        }
        return undefined;
    }
    /**
     * Getter for the current binding
     */
    get currentBinding() {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const element = this.stack[i];
            if (isBinding(element))
                return element.value;
        }
        return undefined;
    }
    /**
     * Enter the resolution of the given binding. If
     * @param binding - Binding
     */
    pushBinding(binding) {
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Enter binding:', binding.toJSON());
        }
        if (this.stack.find(i => isBinding(i) && i.value === binding)) {
            const msg = `Circular dependency detected: ` +
                `${this.getResolutionPath()} --> ${binding.key}`;
            debugSession(msg);
            throw new Error(msg);
        }
        this.stack.push({ type: 'binding', value: binding });
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Resolution path:', this.getResolutionPath());
        }
    }
    /**
     * Exit the resolution of a binding
     */
    popBinding() {
        const top = this.stack.pop();
        if (!isBinding(top)) {
            throw new Error('The top element must be a binding');
        }
        const binding = top.value;
        /* istanbul ignore if */
        if (debugSession.enabled) {
            debugSession('Exit binding:', binding === null || binding === void 0 ? void 0 : binding.toJSON());
            debugSession('Resolution path:', this.getResolutionPath() || '<empty>');
        }
        return binding;
    }
    /**
     * Getter for bindings on the stack
     */
    get bindingStack() {
        return this.stack.filter(isBinding).map(e => e.value);
    }
    /**
     * Getter for injections on the stack
     */
    get injectionStack() {
        return this.stack.filter(isInjection).map(e => e.value);
    }
    /**
     * Get the binding path as `bindingA --> bindingB --> bindingC`.
     */
    getBindingPath() {
        return this.stack.filter(isBinding).map(describe).join(' --> ');
    }
    /**
     * Get the injection path as `injectionA --> injectionB --> injectionC`.
     */
    getInjectionPath() {
        return this.injectionStack
            .map(i => ResolutionSession.describeInjection(i).targetName)
            .join(' --> ');
    }
    /**
     * Get the resolution path including bindings and injections, for example:
     * `bindingA --> @ClassA[0] --> bindingB --> @ClassB.prototype.prop1
     * --> bindingC`.
     */
    getResolutionPath() {
        return this.stack.map(describe).join(' --> ');
    }
    toString() {
        return this.getResolutionPath();
    }
}
exports.ResolutionSession = ResolutionSession;
function describe(e) {
    switch (e.type) {
        case 'injection':
            return '@' + ResolutionSession.describeInjection(e.value).targetName;
        case 'binding':
            return e.value.key;
    }
}
/**
 * Normalize ResolutionOptionsOrSession to ResolutionOptions
 * @param optionsOrSession - resolution options or session
 */
function asResolutionOptions(optionsOrSession) {
    // backwards compatibility
    if (optionsOrSession instanceof ResolutionSession) {
        return { session: optionsOrSession };
    }
    return optionsOrSession !== null && optionsOrSession !== void 0 ? optionsOrSession : {};
}
exports.asResolutionOptions = asResolutionOptions;
/**
 * Error for context binding resolutions and dependency injections
 */
class ResolutionError extends Error {
    constructor(message, resolutionCtx) {
        super(ResolutionError.buildMessage(message, resolutionCtx));
        this.resolutionCtx = resolutionCtx;
        this.name = ResolutionError.name;
    }
    static buildDetails(resolutionCtx) {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            context: (_b = (_a = resolutionCtx.context) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
            binding: (_d = (_c = resolutionCtx.binding) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : '',
            resolutionPath: (_g = (_f = (_e = resolutionCtx.options) === null || _e === void 0 ? void 0 : _e.session) === null || _f === void 0 ? void 0 : _f.getResolutionPath()) !== null && _g !== void 0 ? _g : '',
        };
    }
    /**
     * Build the error message for the resolution to include more contextual data
     * @param reason - Cause of the error
     * @param resolutionCtx - Resolution context
     */
    static buildMessage(reason, resolutionCtx) {
        const info = this.describeResolutionContext(resolutionCtx);
        const message = `${reason} (${info})`;
        return message;
    }
    static describeResolutionContext(resolutionCtx) {
        const details = ResolutionError.buildDetails(resolutionCtx);
        const items = [];
        for (const [name, val] of Object.entries(details)) {
            if (val !== '') {
                items.push(`${name}: ${val}`);
            }
        }
        return items.join(', ');
    }
}
exports.ResolutionError = ResolutionError;
//# sourceMappingURL=resolution-session.js.map