import chalk from 'chalk';
import Configstore from 'configstore';
import * as fs from 'fs/promises';
import fetch from 'node-fetch';
import { Ora } from 'ora';
import path from 'path';
import * as unzipper from 'unzipper';
import { checkFolder, deployTemplates } from '../../utils/deploy/index.js';
import { logline } from '../../utils/index.js';
import { PersonalizeConfig } from '../../utils/personalizeConfig.js';
import { TemplateType } from '../api/templates/TemplateType.js';
import { DeployProps } from './deploy.interface.js';

export const DeployService = (config: Configstore, personalizeConfig: PersonalizeConfig) => {
  const deploy = async ({ artifactPath = './artifacts', templateType = TemplateType.All }: DeployProps) => {
    const artifactDirectory = path.join(process.cwd(), artifactPath);

    if (!(await checkFolder(artifactDirectory))) {
      logline(chalk.red(`Artifacts folder doesn't exist`));
      return;
    }

    await deployTemplates(artifactDirectory, templateType, config);
  };

  const deployRepository = async ({
    repositoryPath,
    spinner,
    artifactPath = './artifacts',
  }: {
    repositoryPath: String;
    spinner: Ora;
    artifactPath?: String;
  }) => {
    // Run code to pull the zip of the github repository and store temporarily
    try {
      const data = await fetch(`https://api.github.com/repos/${repositoryPath}/zipball`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (data.ok) {
        let bufferArr: ArrayBuffer = await data.arrayBuffer();

        if (bufferArr.byteLength === 0) {
          spinner.fail(`Failed to pull the repository from Github, it didn't contain any files`);
          return;
        }

        const buffer = Buffer.from(bufferArr);

        if (buffer.byteLength === 0) {
          spinner.fail(`Failed to pull the repository from Github, it didn't contain any files`);
          return;
        }

        // Store the zip file in a temporary location
        let tempLocation = path.join(process.cwd(), 'temp');

        if (!(await checkFolder(tempLocation))) {
          logline(chalk.red(`Failed to create temp folder`));
          return;
        }

        let zipLocation = path.join(tempLocation, 'repository.zip');

        await fs.writeFile(zipLocation, buffer);

        // Unzip the file
        let unzipLocation = path.join(tempLocation, 'repository');

        const createReadStream = require('fs').createReadStream;

        await createReadStream(zipLocation).pipe(unzipper.Extract({ path: unzipLocation }));

        // console.log list of files
        const files = await fs.readdir(unzipLocation);

        console.log(files);

        // Deploy the artifacts
        //await deploy({ artifactPath: unzipLocation, templateType: TemplateType.All });

        // Clean up
        await fs.unlink(zipLocation);
        await fs.rmdir(unzipLocation, { recursive: true });
      } else {
        spinner.fail(`Failed to pull the repository from Github with status code: ${data.status}`);
        return;
      }
    } catch (ex) {
      spinner.fail(`Failed to pull the repository from Github with error: ${ex}`);
      return;
    }
  };

  return { deploy, deployRepository };
};
