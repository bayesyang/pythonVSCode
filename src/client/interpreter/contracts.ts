import { ConfigurationTarget, Uri } from 'vscode';
import { Architecture } from '../common/registry';

export interface IInterpreterLocatorService {
    getInterpreters(resource?: Uri): Promise<PythonInterpreter[]>;
}

export type PythonInterpreter = {
    path: string;
    companyDisplayName?: string;
    displayName?: string;
    version?: string;
    architecture?: Architecture;
};

export type WorkspacePythonPath = {
    folderUri: Uri;
    pytonPath?: string;
    configTarget: ConfigurationTarget.Workspace | ConfigurationTarget.WorkspaceFolder;
};
