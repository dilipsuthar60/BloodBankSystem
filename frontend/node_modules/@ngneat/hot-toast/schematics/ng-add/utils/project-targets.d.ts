import { SchematicsException } from '@angular-devkit/schematics';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
/** Resolves the architect options for the build target of the given project. */
export declare const getProjectTargetOptions: (project: WorkspaceProject, buildTarget: string) => any;
export declare const targetBuildNotFoundError: () => SchematicsException;
