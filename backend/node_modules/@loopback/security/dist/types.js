"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSubject = exports.Permission = exports.TypedPrincipal = exports.securityId = void 0;
/**
 * A symbol for stringified id of security related objects
 */
exports.securityId = Symbol('securityId');
class TypedPrincipal {
    constructor(principal, type) {
        this.principal = principal;
        this.type = type;
    }
    get [exports.securityId]() {
        return `${this.type}:${this.principal[exports.securityId]}`;
    }
}
exports.TypedPrincipal = TypedPrincipal;
/**
 * `Permission` defines an action/access against a protected resource. It's
 * the `what` for security.
 *
 * There are three levels of permissions
 *
 * - Resource level (Order, User)
 * - Instance level (Order-0001, User-1001)
 * - Property level (User-0001.email)
 *
 * @example
 * - create a user (action: create, resource type: user)
 * - read email of a user (action: read, resource property: user.email)
 * - change email of a user (action: update, resource property: user.email)
 * - cancel an order (action: delete, resource type: order)
 */
class Permission {
    get [exports.securityId]() {
        const resIds = [];
        resIds.push(this.resourceType);
        if (this.resourceProperty) {
            resIds.push(this.resourceProperty);
        }
        const inst = this.resourceId ? `:${this.resourceId}` : '';
        return `${resIds.join('.')}:${this.action}${inst}`;
    }
}
exports.Permission = Permission;
/**
 * Default implementation of `Subject`
 */
class DefaultSubject {
    constructor() {
        this.principals = new Set();
        this.authorities = new Set();
        this.credentials = new Set();
    }
    addUser(...users) {
        for (const user of users) {
            this.principals.add(new TypedPrincipal(user, 'USER'));
        }
    }
    addApplication(app) {
        this.principals.add(new TypedPrincipal(app, 'APPLICATION'));
    }
    addAuthority(...authorities) {
        for (const authority of authorities) {
            this.authorities.add(authority);
        }
    }
    addCredential(...credentials) {
        for (const credential of credentials) {
            this.credentials.add(credential);
        }
    }
    getPrincipal(type) {
        let principal;
        for (const p of this.principals) {
            if (p.type === type) {
                principal = p.principal;
                break;
            }
        }
        return principal;
    }
    get user() {
        return this.getPrincipal('USER');
    }
}
exports.DefaultSubject = DefaultSubject;
//# sourceMappingURL=types.js.map