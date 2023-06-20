"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineKeyValueRepositoryClass = exports.defineCrudRepositoryClass = exports.defineRepositoryClass = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const repositories_1 = require("./repositories");
/**
 * Create (define) a repository class for the given model.
 *
 * See also `defineCrudRepositoryClass` and `defineKeyValueRepositoryClass`
 * for convenience wrappers providing repository class factory for the default
 * CRUD and KeyValue implementations.
 *
 * **❗️IMPORTANT: The compiler (TypeScript 3.8) is not able to correctly infer
 * generic arguments `M` and `R` from the class constructors provided in
 * function arguments. You must always provide both M and R types explicitly.**
 *
 * @example
 *
 * ```ts
 * const AddressRepository = defineRepositoryClass<
 *   typeof Address,
 *   DefaultEntityCrudRepository<
 *    Address,
 *    typeof Address.prototype.id,
 *    AddressRelations
 *   >,
 * >(Address, DefaultCrudRepository);
 * ```
 *
 * @param modelClass - A model class such as `Address`.
 * @param baseRepositoryClass - Repository implementation to use as the base,
 * e.g. `DefaultCrudRepository`.
 *
 * @typeParam M - Model class constructor (e.g. `typeof Address`)
 * @typeParam R - Repository class (e.g. `DefaultCrudRepository<Address, number>`)
 */
function defineRepositoryClass(modelClass, baseRepositoryClass) {
    const repoName = modelClass.name + 'Repository';
    const defineNamedRepo = new Function('ModelCtor', 'BaseRepository', `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(ModelCtor, dataSource);
      }
    };`);
    const repo = defineNamedRepo(modelClass, baseRepositoryClass);
    assert_1.default.equal(repo.name, repoName);
    return repo;
}
exports.defineRepositoryClass = defineRepositoryClass;
/**
 * Create (define) an entity CRUD repository class for the given model.
 * This function always uses `DefaultCrudRepository` as the base class,
 * use `defineRepositoryClass` if you want to use your own base repository.
 *
 * @example
 *
 * ```ts
 * const ProductRepository = defineCrudRepositoryClass<
 *   Product,
 *   typeof Product.prototype.id,
 *   ProductRelations
 * >(Product);
 * ```
 *
 * @param entityClass - An entity class such as `Product`.
 *
 * @typeParam E - An entity class
 * @typeParam IdType - ID type for the entity
 * @typeParam Relations - Relations for the entity
 */
function defineCrudRepositoryClass(entityClass) {
    return defineRepositoryClass(entityClass, repositories_1.DefaultCrudRepository);
}
exports.defineCrudRepositoryClass = defineCrudRepositoryClass;
/**
 * Create (define) a KeyValue repository class for the given entity.
 * This function always uses `DefaultKeyValueRepository` as the base class,
 * use `defineRepositoryClass` if you want to use your own base repository.
 *
 * @example
 *
 * ```ts
 * const ProductKeyValueRepository = defineKeyValueRepositoryClass(Product);
 * ```
 *
 * @param modelClass - An entity class such as `Product`.
 *
 * @typeParam M - Model class
 */
function defineKeyValueRepositoryClass(modelClass) {
    return defineRepositoryClass(modelClass, repositories_1.DefaultKeyValueRepository);
}
exports.defineKeyValueRepositoryClass = defineKeyValueRepositoryClass;
//# sourceMappingURL=define-repository-class.js.map