import { ApplicationWithRepositories } from '@loopback/repository';
import { ArtifactOptions } from '../types';
import { BaseArtifactBooter } from './base-artifact.booter';
/**
 * A class that extends BaseArtifactBooter to boot the 'Model' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - Model Artifact Options Object
 */
export declare class ModelBooter extends BaseArtifactBooter {
    app: ApplicationWithRepositories;
    modelConfig: ArtifactOptions;
    constructor(app: ApplicationWithRepositories, projectRoot: string, modelConfig?: ArtifactOptions);
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    load(): Promise<void>;
}
/**
 * Default ArtifactOptions for DataSourceBooter.
 */
export declare const ModelDefaults: ArtifactOptions;
