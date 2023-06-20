"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortListOfGroups = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const toposort_1 = tslib_1.__importDefault(require("toposort"));
const debug = (0, debug_1.default)('loopback:middleware');
/**
 * Sort the groups by their relative order
 * @param orderedGroups - A list of arrays - each of which represents a partial
 * order of groups.
 */
function sortListOfGroups(...orderedGroups) {
    if (debug.enabled) {
        debug('Dependency graph: %s', orderedGroups.map(edge => edge.join('->')).join(', '));
    }
    const graph = [];
    for (const groups of orderedGroups) {
        if (groups.length >= 2) {
            groups.reduce((prev, group) => {
                if (typeof prev === 'string') {
                    graph.push([prev, group]);
                }
                return group;
            }, undefined);
        }
    }
    const sorted = (0, toposort_1.default)(graph);
    debug('Sorted groups: %s', sorted.join('->'));
    return sorted;
}
exports.sortListOfGroups = sortListOfGroups;
//# sourceMappingURL=group-sorter.js.map