import { Command } from 'commander';
import Configstore from 'configstore';
import path from 'path';
import { initServiceLocation, logline } from '../../utils/index.js';
import chalk from 'chalk';
import { checkFolder, deployTemplates } from '../../utils/deploy/index.js';
import { TemplateType } from '../api/templates/TemplateType.js';
import { Authenticate } from '../api/index.js';

interface DeployProps {
  artifactPath: string;
  templateType: TemplateType;
}

let globalConfig: Configstore;

const deploy = async ({ artifactPath = './artifacts', templateType = TemplateType.All }: DeployProps) => {
  const artifactDirectory = path.join(process.cwd(), artifactPath);

  if (!(await checkFolder(artifactDirectory))) {
    logline(chalk.red(`Artifacts folder doesn't exist`));
    return;
  }

  await deployTemplates(artifactDirectory, templateType, globalConfig);
};

const deployRepository = async ({
  repositoryPath,
  artifactPath = './artifacts',
}: {
  repositoryPath: String;
  artifactPath: String;
}) => {
  // Run code to pull the zip of the github repository and store temporarily
  try {
    let data = await fetch(`https://api.github.com/repos/${repositoryPath}/zipball`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  } catch (ex) {
    logline(chalk.red(`Failed to pull the repository from Github`));
    return;
  }
};

const initDeployCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const deployCommands = program
    .command('deploy')
    .option('--artifactPath <artifactPath>', 'Path to your CDP/Personalize Artifacts to deploy', './artifacts')
    .option('--templateType <type>', 'The template type to deploy (audience|decision|web)', TemplateType.All)
    .description('Will consume artifacts and deploy them to CDP/Personalize tenant')
    .action(async (options) => {
      await deploy({ artifactPath: options.artifactPath, templateType: options.templateType });
    });

  // Sub commands
  deployCommands
    .command('repository')
    .requiredOption('-r, --repository <repository>', 'The repository to deploy')
    .requiredOption('-id, --clientId <clientId>', 'The client id to deploy')
    .requiredOption('-s, --secret <secret>', 'The secret to deploy')
    .option('-c, --cloudPortal <cloudPortal>', 'The cloud portal to deploy to', 'true')
    .option('-l, --location <location>', 'The location to deploy to', 'EU')
    .option('--staging <staging>', 'The staging to deploy to', 'false')
    .option('--artifactPath <artifactPath>', 'Path to your CDP/Personalize Artifacts to deploy', './artifacts')
    .description('A single command that takes a repository and deploys to a specific tenant with provided variables')
    .action(async (options) => {
      initServiceLocation({
        location: options.location,
        config: config,
        isCloudPortal: options.cloudPortal ?? true,
        isStaging: options.staging ?? false,
      });
      config.set('clientKey', options.clientId);

      await Authenticate(options.clientId, options.secret, options.cloudPortal ?? true, options.staging ?? false);

      //await deployRepository({ repositoryPath: options.repository });
    });

  return deployCommands;
};

export { initDeployCommands };
