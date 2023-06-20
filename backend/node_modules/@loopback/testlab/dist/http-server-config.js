"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.givenHttpServerConfig = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const FIXTURES = path_1.default.resolve(__dirname, '../fixtures');
const DUMMY_TLS_CONFIG = {
    key: (0, fs_1.readFileSync)(path_1.default.join(FIXTURES, 'key.pem')),
    cert: (0, fs_1.readFileSync)(path_1.default.join(FIXTURES, 'cert.pem')),
};
/**
 * Assertion type guard for TypeScript to ensure `host` and `port` are set
 * @param config - Host/port configuration
 */
function assertHostPort(config) {
    (0, assert_1.default)(config.host != null, 'host is not set');
    (0, assert_1.default)(config.port != null, 'port is not set');
}
/**
 * Create an HTTP-server configuration that works well in test environments.
 *  - Ask the operating system to assign a free (ephemeral) port.
 *  - Use IPv4 localhost `127.0.0.1` to avoid known IPv6 issues in Docker-based
 *    environments like Travis-CI.
 *  - Provide default TLS key & cert when `protocol` is set to `https`.
 *
 * @param customConfig - Additional configuration options to apply.
 */
function givenHttpServerConfig(customConfig) {
    const defaults = { host: '127.0.0.1', port: 0 };
    if (isHttpsConfig(customConfig)) {
        const config = { ...customConfig };
        if (config.host == null)
            config.host = defaults.host;
        if (config.port == null)
            config.port = defaults.port;
        setupTlsConfig(config);
        assertHostPort(config);
        return config;
    }
    assertHttpConfig(customConfig);
    const config = { ...customConfig };
    if (config.host == null)
        config.host = defaults.host;
    if (config.port == null)
        config.port = defaults.port;
    assertHostPort(config);
    return config;
}
exports.givenHttpServerConfig = givenHttpServerConfig;
function setupTlsConfig(config) {
    if ('key' in config && 'cert' in config)
        return;
    if ('pfx' in config)
        return;
    Object.assign(config, DUMMY_TLS_CONFIG);
}
/**
 * Type guard to check if the parameter is `HttpsOptions`
 */
function isHttpsConfig(config) {
    return (config === null || config === void 0 ? void 0 : config.protocol) === 'https';
}
/**
 * Type guard to assert the parameter is `HttpOptions`
 * @param config - Http config
 */
function assertHttpConfig(config) {
    (0, assert_1.default)((config === null || config === void 0 ? void 0 : config.protocol) == null || (config === null || config === void 0 ? void 0 : config.protocol) === 'http');
}
//# sourceMappingURL=http-server-config.js.map