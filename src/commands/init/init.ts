import { Command } from 'commander';
import Configstore from 'configstore';
import * as fs from 'fs/promises';
import ora, { Ora } from 'ora';
import * as path from 'path';
import { PersonalizeConfig } from '../../utils/personalizeConfig.js';
import { logline } from '../../utils/command-helpers.js';

let globalConfig: Configstore;

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const initRepository = async (spinner: Ora) => {
  // This will create our personalize.config.json file in the current directory and set default values
  const defaultConfig: PersonalizeConfig = {
    serializeDirectory: './artifacts',
    staging: false,
  };

  try {
    const configPath = path.resolve(process.cwd(), 'personalize.config.json');
    const exists = await fileExists(configPath);

    if (!exists) {
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
      logline('personalize.config.json created');
    } else {
      spinner.warn('personalize.config.json already exists - skipping creation of file');
    }
  } catch (error) {
    spinner.fail('Failed to initialize Personalize project');
    console.error(error);
  }

  spinner.succeed('Personalize project initialized');
};

const initCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const initCommands = program
    .command('init')
    .description(
      'This will initialize the current directory as a Personalize project. It will create a personalize.config.json file with default values.'
    )
    .action(async () => {
      const spinner = ora('Initializing Personalize project').start();

      await initRepository(spinner);
    });

  return initCommands;
};

export { initCommands };
