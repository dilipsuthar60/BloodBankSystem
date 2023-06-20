/**
 * Options for a test sandbox
 */
export interface TestSandboxOptions {
    /**
     * The `subdir` controls if/how the sandbox creates a subdirectory under the
     * root path. It has one of the following values:
     *
     * - `true`: Creates a unique subdirectory. This will be the default behavior.
     * - `false`: Uses the root path as the target directory without creating a
     * subdirectory.
     * - a string such as `sub-dir-1`: creates a subdirectory with the given value.
     */
    subdir: boolean | string;
}
/**
 * TestSandbox class provides a convenient way to get a reference to a
 * sandbox folder in which you can perform operations for testing purposes.
 */
export declare class TestSandbox {
    private _path?;
    get path(): string;
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
    constructor(rootPath: string, options?: TestSandboxOptions);
    /**
     * Resets the TestSandbox. (Remove all files in it).
     */
    reset(): Promise<void>;
    /**
     * Deletes the TestSandbox.
     */
    delete(): Promise<void>;
    /**
     * Makes a directory in the TestSandbox
     *
     * @param dir - Name of directory to create (relative to TestSandbox path)
     */
    mkdir(dir: string): Promise<void>;
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
    copyFile(src: string, dest?: string, transform?: (content: string) => string): Promise<void>;
    /**
     * Creates a new file and writes the given data serialized as JSON.
     *
     * @param dest - Destination filename, optionally including a relative path.
     * @param data - The data to write.
     */
    writeJsonFile(dest: string, data: unknown): Promise<void>;
    /**
     * Creates a new file and writes the given data as a UTF-8-encoded text.
     *
     * @param dest - Destination filename, optionally including a relative path.
     * @param data - The text to write.
     */
    writeTextFile(dest: string, data: string): Promise<void>;
}
