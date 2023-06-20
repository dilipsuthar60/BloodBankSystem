"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountComponent = void 0;
const context_1 = require("@loopback/context");
/**
 * Mount a component to an Application.
 *
 * @param app - Application
 * @param component - Component instance
 */
function mountComponent(app, component) {
    if (component.classes) {
        for (const classKey in component.classes) {
            const binding = (0, context_1.createBindingFromClass)(component.classes[classKey], {
                key: classKey,
            });
            app.add(binding);
        }
    }
    if (component.providers) {
        for (const providerKey in component.providers) {
            const binding = (0, context_1.createBindingFromClass)(component.providers[providerKey], {
                key: providerKey,
            });
            app.add(binding);
        }
    }
    if (component.bindings) {
        for (const binding of component.bindings) {
            app.add(binding);
        }
    }
    if (component.controllers) {
        for (const controllerCtor of component.controllers) {
            app.controller(controllerCtor);
        }
    }
    if (component.servers) {
        for (const serverKey in component.servers) {
            app.server(component.servers[serverKey], serverKey);
        }
    }
    if (component.lifeCycleObservers) {
        for (const observer of component.lifeCycleObservers) {
            app.lifeCycleObserver(observer);
        }
    }
    if (component.services) {
        for (const service of component.services) {
            app.service(service);
        }
    }
}
exports.mountComponent = mountComponent;
//# sourceMappingURL=component.js.map