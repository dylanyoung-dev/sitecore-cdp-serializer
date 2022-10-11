import { Command } from 'commander';
import Configstore from 'configstore';
import path from 'path';
import { logline } from '../../utils/index.js';
import chalk from 'chalk';
import { checkFolder, deployTemplates } from '../../utils/deploy/index.js';

interface DeployProps {
  artifactPath: string;
}

let globalConfig: Configstore;

const deploy = async ({ artifactPath = './artifacts' }: DeployProps) => {
  const artifactDirectory = path.join(process.cwd(), artifactPath);

  if (!(await checkFolder(artifactDirectory))) {
    logline(chalk.red(`Artifacts folder doesn't exist`));
    return;
  }

  await deployTemplates(artifactDirectory, globalConfig);
};

const initDeployCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const deployCommands = program
    .command('deploy')
    .option(
      '--artifactPath <artifactPath>',
      'Path to your CDP/Personalize Artifacts to deploy',
      './artifacts'
    )
    .description('Will consume artifacts and deploy them to CDP/Personalize tenant')
    .action(async (options) => {
      await deploy({ artifactPath: options.artifactPath });
    });

  //deployCommands.command('templates').action(async (options) => {

  //});

  return deployCommands;
};

export { initDeployCommands };
