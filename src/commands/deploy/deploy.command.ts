import { Command } from 'commander';
import Configstore from 'configstore';
import ora from 'ora';
import { initServiceLocation } from '../../utils/index.js';
import { PersonalizeConfig } from '../../utils/personalizeConfig.js';
import { AuthService } from '../api/index.js';
import { TemplateType } from '../api/templates/TemplateType.js';
import { DeployService } from './deploy.service.js';

const initDeployCommands = (program: Command, config: Configstore, personalizeConfig: PersonalizeConfig) => {
  const deployService = DeployService(config, personalizeConfig);

  const deployCommands = program
    .command('deploy')
    .option('--templateType <type>', 'The template type to deploy (audience|decision|web)', TemplateType.All)
    .description('Will consume artifacts and deploy them to CDP/Personalize tenant')
    .action(async (options) => {
      await deployService.deploy({ artifactPath: options.artifactPath, templateType: options.templateType });
    });

  // Sub commands
  deployCommands
    .command('repository')
    .requiredOption(
      '-r, --repository <repository>',
      "The repository to deploy, for example: https://github.com/AdobeDocs/project-firefly should be 'AdobeDocs/project-firefly'"
    )
    .requiredOption('-id, --clientId <clientId>', 'The client id to deploy')
    .requiredOption('-s, --secret <secret>', 'The secret to deploy')
    .option('-c, --cloudPortal <cloudPortal>', 'The cloud portal to deploy to', 'true')
    .option('-l, --location <location>', 'The location to deploy to', 'EU')
    .description('A single command that takes a repository and deploys to a specific tenant with provided variables')
    .action(async (options) => {
      const spinner = ora(
        `Deploying Repository ${options.repository} to ${options.location} with client id ${options.clientId}`
      ).start();
      const authService = AuthService(config, personalizeConfig);

      initServiceLocation({
        location: options.location,
        config: config,
        isCloudPortal: options.cloudPortal ?? true,
        isStaging: personalizeConfig.staging ?? false,
      });

      config.set('clientKey', options.clientId);

      await authService.Authenticate(options.clientId, options.secret, options.cloudPortal ?? true);

      await deployService.deployRepository({ repositoryPath: options.repository, spinner });
    });

  return deployCommands;
};

export { initDeployCommands };
