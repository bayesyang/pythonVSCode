import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { Installer, Product } from '../../common/installer';
import { ITestConfigSettingsService } from '../common/contracts';
import { TestConfigurationManager } from '../common/testConfigurationManager';

export class ConfigurationManager extends TestConfigurationManager {
    constructor(workspace: Uri, outputChannel: vscode.OutputChannel,
        installer: Installer, testConfigSettingsService: ITestConfigSettingsService) {
        super(workspace, Product.nosetest, outputChannel, installer, testConfigSettingsService);
    }
    private static async configFilesExist(rootDir: string): Promise<string[]> {
        const promises = ['.noserc', 'nose.cfg'].map(cfg => {
            return new Promise<string>(resolve => {
                fs.exists(path.join(rootDir, cfg), exists => { resolve(exists ? cfg : ''); });
            });
        });
        const values = await Promise.all(promises);
        return values.filter(exists => exists.length > 0);
    }
    // tslint:disable-next-line:no-any
    public async configure(rootDir: string): Promise<any> {
        const args: string[] = [];
        const configFileOptionLabel = 'Use existing config file';
        const configFiles = await ConfigurationManager.configFilesExist(rootDir);
        // If a config file exits, there's nothing to be configured.
        if (configFiles.length > 0) {
            return;
        }

        const subDirs = await this.getTestDirs(rootDir);
        const testDir = await this.selectTestDir(rootDir, subDirs);
        if (typeof testDir === 'string' && testDir !== configFileOptionLabel) {
            args.push(testDir);
        }
        const installed = await this.installer.isInstalled(Product.nosetest);
        if (!installed) {
            await this.installer.install(Product.nosetest);
        }
        await this.testConfigSettingsService.updateTestArgs(rootDir, Product.nosetest, args);
    }
}
