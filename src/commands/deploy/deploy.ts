import { Command } from 'commander';
import Configstore from 'configstore';

interface DeployProps {
  artifactPath: string;
}

const deploy = ({ artifactPath = './artifacts' }: DeployProps) => {};

const initDeployCommands = (program: Command, config: Configstore) => {
  program
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
};

export { initDeployCommands };
