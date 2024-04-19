import * as fs from 'fs/promises';
import * as path from 'path';

export interface PersonalizeConfig {
  serializeDirectory: string;
  staging: false;
}

export const loadConfig = async (): Promise<PersonalizeConfig> => {
  const configPath = path.resolve(process.cwd(), 'personalize.config.json');

  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configContent) as PersonalizeConfig;
  } catch (error) {
    console.warn('You need to initialize your repository by running `npx sitecore-cdp-serializer init`');
    throw error;
  }
};
