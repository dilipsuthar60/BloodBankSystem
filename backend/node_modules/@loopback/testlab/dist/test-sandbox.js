"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSandbox = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
/**
 * TestSandbox class provides a convenient way to get a reference to a
 * sandbox folder in which you can perform operations for testing purposes.
 */
class TestSandbox {
    get path() {
        if (!this._path) {
            throw new Error(`TestSandbox instance was deleted. Create a new instance.`);
        }
        return this._path;
    }
    /**
     * Will create a directory if it doesn't already exist. If it exists, you
     * still get an instance of the TestSandbox.
     *
     * @example
     * ```ts
     * // Create a sandbox as a unique temporary subdirectory under the rootPath
     * const sandbox = new TestSandbox(rootPath);
     * const sandbox = new TestSandbox(rootPath, {subdir: true});
     *
     * // Create a sandbox in the root path directly
     * // This is same as the old behavior
     * const sandbox = new TestSandbox(rootPath, {subdir: false});
     *
     * // Create a sandbox in the `test1` subdirectory of the root path
     * const sandbox = new TestSandbox(rootPath, {subdir: 'test1'});
     * ```
     *
     * @param rootPath - Root path of the TestSandbox. If relative it will be
     * resolved against the current directory.
     * @param options - Options to control if/how the sandbox creates a
     * subdirectory for the sandbox. If not provided, the sandbox
     * will automatically creates a unique temporary subdirectory. This allows
     * sandboxes with the same root path can be used in parallel during testing.
     */
    constructor(rootPath, options) {
        rootPath = (0, path_1.resolve)(rootPath);
        (0, fs_extra_1.ensureDirSync)(rootPath);
        options = { subdir: true, ...options };
        const subdir = typeof options.subdir === 'string' ? options.subdir : '.';
        if (options.subdir !== true) {
            this._path = (0, path_1.resolve)(rootPath, subdir);
        }
        else {
            // Create a unique temporary directory under the root path
            // See https://nodejs.org/api/fs.html#fs_fs_mkdtempsync_prefix_options
            this._path = (0, fs_extra_1.mkdtempSync)((0, path_1.join)(rootPath, `/${process.pid}`));
        }
    }
    /**
     * Resets the TestSandbox. (Remove all files in it).
     */
    async reset() {
        // Decache files from require's cache so future tests aren't affected incase
        // a file is recreated in sandbox with the same file name but different
        // contents after resetting the sandbox.
        for (const key in require.cache) {
            if (key.startsWith(this.path)) {
                delete require.cache[key];
            }
        }
        await (0, fs_extra_1.emptyDir)(this.path);
    }
    /**
     * Deletes the TestSandbox.
     */
    async delete() {
        await (0, fs_extra_1.remove)(this.path);
        delete this._path;
    }
    /**
     * Makes a directory in the TestSandbox
     *
     * @param dir - Name of directory to create (relative to TestSandbox path)
     */
    async mkdir(dir) {
        await (0, fs_extra_1.ensureDir)((0, path_1.resolve)(this.path, dir));
    }
    /**
     * Copies a file from src to the TestSandbox. If copying a `.js` file which
     * has an accompanying `.js.map` file in the src file location, the dest file
     * will have its sourceMappingURL updated to point to the original file as
     * an absolute path so you don't need to copy the map file.
     *
     * @param src - Absolute path of file to be copied to the TestSandbox
     * @param dest - Optional. Destination filename of the copy operation
     * (relative to TestSandbox). Original filename used if not specified.
     * @param transform - Optional. A function to transform the file content.
     */
    async copyFile(src, dest, transform) {
        dest = dest
            ? (0, path_1.resolve)(this.path, dest)
            : (0, path_1.resolve)(this.path, (0, path_1.parse)(src).base);
        if (transform == null) {
            await (0, fs_extra_1.copy)(src, dest);
        }
        else {
            let content = await (0, fs_extra_1.readFile)(src, 'utf-8');
            content = transform(content);
            await (0, fs_extra_1.outputFile)(dest, content, { encoding: 'utf-8' });
        }
        if ((0, path_1.parse)(src).ext === '.js' && (await (0, fs_extra_1.pathExists)(src + '.map'))) {
            const srcMap = src + '.map';
            await (0, fs_extra_1.appendFile)(dest, `\n//# sourceMappingURL=${srcMap}`);
        }
    }
    /**
     * Creates a new file and writes the given data serialized as JSON.
     *
     * @param dest - Destination filename, optionally including a relative path.
     * @param data - The data to write.
     */
    async writeJsonFile(dest, data) {
        dest = (0, path_1.resolve)(this.path, dest);
        return (0, fs_extra_1.outputJson)(dest, data, { spaces: 2 });
    }
    /**
     * Creates a new file and writes the given data as a UTF-8-encoded text.
     *
     * @param dest - Destination filename, optionally including a relative path.
     * @param data - The text to write.
     */
    async writeTextFile(dest, data) {
        dest = (0, path_1.resolve)(this.path, dest);
        return (0, fs_extra_1.outputFile)(dest, data, 'utf-8');
    }
}
exports.TestSandbox = TestSandbox;
//# sourceMappingURL=test-sandbox.js.map