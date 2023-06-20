"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryBindings = exports.RepositoryTags = void 0;
/**
 * Binding tags for repository related bindings
 */
var RepositoryTags;
(function (RepositoryTags) {
    /**
     * Tag for model class bindings
     */
    RepositoryTags.MODEL = 'model';
    /**
     * Tag for repository bindings
     */
    RepositoryTags.REPOSITORY = 'repository';
    /**
     * Tag for datasource bindings
     */
    RepositoryTags.DATASOURCE = 'datasource';
})(RepositoryTags = exports.RepositoryTags || (exports.RepositoryTags = {}));
/**
 * Binding keys and namespaces for repository related bindings
 */
var RepositoryBindings;
(function (RepositoryBindings) {
    /**
     * Namespace for model class bindings
     */
    RepositoryBindings.MODELS = 'models';
    /**
     * Namespace for repository bindings
     */
    RepositoryBindings.REPOSITORIES = 'repositories';
    /**
     * Namespace for datasource bindings
     */
    RepositoryBindings.DATASOURCES = 'datasources';
})(RepositoryBindings = exports.RepositoryBindings || (exports.RepositoryBindings = {}));
//# sourceMappingURL=keys.js.map