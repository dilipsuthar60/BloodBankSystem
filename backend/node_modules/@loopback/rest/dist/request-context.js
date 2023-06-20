"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const express_1 = require("@loopback/express");
const keys_1 = require("./keys");
/**
 * A per-request Context combining an IoC container with handler context
 * (request, response, etc.).
 */
class RequestContext extends express_1.MiddlewareContext {
    /**
     * Get the protocol used by the client to make the request.
     * Please note this protocol may be different from what we are observing
     * at HTTP/TCP level, because reverse proxies like nginx or sidecars like
     * Envoy are switching between protocols.
     */
    get requestedProtocol() {
        var _a, _b;
        return ((_b = (((_a = this.request.get('x-forwarded-proto')) !== null && _a !== void 0 ? _a : '').split(',')[0] ||
            this.request.protocol ||
            this.serverConfig.protocol)) !== null && _b !== void 0 ? _b : 'http');
    }
    /**
     * Get the effective base path of the incoming request. This base path
     * combines `baseUrl` provided by Express when LB4 handler is mounted on
     * a non-root path, with the `basePath` value configured at LB4 side.
     */
    get basePath() {
        var _a;
        const request = this.request;
        let basePath = (_a = this.serverConfig.basePath) !== null && _a !== void 0 ? _a : '';
        if (request.baseUrl && request.baseUrl !== '/') {
            if (!basePath || request.baseUrl.endsWith(basePath)) {
                // Express has already applied basePath to baseUrl
                basePath = request.baseUrl;
            }
            else {
                basePath = request.baseUrl + basePath;
            }
        }
        return basePath;
    }
    /**
     * Get the base URL used by the client to make the request.
     * This URL contains the protocol, hostname, port and base path.
     * The path of the invoked route and query string is not included.
     *
     * Please note these values may be different from what we are observing
     * at HTTP/TCP level, because reverse proxies like nginx are rewriting them.
     */
    get requestedBaseUrl() {
        var _a, _b, _c;
        const request = this.request;
        const config = this.serverConfig;
        const protocol = this.requestedProtocol;
        // The host can be in one of the forms
        // [::1]:3000
        // [::1]
        // 127.0.0.1:3000
        // 127.0.0.1
        let { host, port } = parseHostAndPort((_a = request.get('x-forwarded-host')) !== null && _a !== void 0 ? _a : request.headers.host);
        const forwardedPort = ((_b = request.get('x-forwarded-port')) !== null && _b !== void 0 ? _b : '').split(',')[0];
        port = forwardedPort || port;
        if (!host) {
            // No host detected from http headers
            // Use the configured values or the local network address
            host = (_c = config.host) !== null && _c !== void 0 ? _c : request.socket.localAddress;
            port = (config.port || request.socket.localPort).toString();
        }
        // clear default ports
        port = protocol === 'https' && port === '443' ? '' : port;
        port = protocol === 'http' && port === '80' ? '' : port;
        // add port number of present
        host += port !== '' ? ':' + port : '';
        return protocol + '://' + host + this.basePath;
    }
    constructor(request, response, parent, serverConfig, name) {
        super(request, response, parent, name);
        this.request = request;
        this.response = response;
        this.serverConfig = serverConfig;
    }
    setupBindings() {
        super.setupBindings();
        this.bind(keys_1.RestBindings.Http.REQUEST).to(this.request).lock();
        this.bind(keys_1.RestBindings.Http.RESPONSE).to(this.response).lock();
        this.bind(keys_1.RestBindings.Http.CONTEXT).to(this).lock();
    }
}
exports.RequestContext = RequestContext;
function parseHostAndPort(host) {
    var _a;
    host = host !== null && host !== void 0 ? host : '';
    host = host.split(',')[0];
    const portPattern = /:([0-9]+)$/;
    const port = ((_a = host.match(portPattern)) !== null && _a !== void 0 ? _a : [])[1] || '';
    host = host.replace(portPattern, '');
    return { host, port };
}
//# sourceMappingURL=request-context.js.map