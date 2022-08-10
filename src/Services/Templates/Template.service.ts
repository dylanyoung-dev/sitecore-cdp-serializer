import Configstore from 'configstore';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { AuthToken } from '../Auth/Auth.interface.js';

interface TemplateProps {
  config: Configstore;
  templateType?: string;
}

const GetAllTemplates = async ({ config, templateType }: TemplateProps) => {
  const credentials: AuthToken = config.get('credentials');
  const serviceUrl = config.get('serviceUrl');

  if (!serviceUrl) {
    console.log(chalk.red('Service URL not set, re-run auth command'));
  }

  if (!credentials) {
    console.log(chalk.red('You must run the auth command first to initialize the CLI'));
    return;
  }

  let servicePath = `https://${serviceUrl}/v3/templates`;

  const response: Response = await fetch(servicePath, {
    method: 'get',
    body: null,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  });

  if (response.ok) {
    console.log('success');
    console.log(await response.json());
  } else {
    console.log(chalk.red('Failed to retrieve templates'));
  }
};

interface GetByFriendlyIdProps {
  friendlyId: string;
  config: Configstore;
}

const GetByFriendlyId = async ({ config, friendlyId }: GetByFriendlyIdProps) => {
  let servicePath = `https://api.boxever.com/v3/templates/${friendlyId}`;
};

export { GetAllTemplates };
