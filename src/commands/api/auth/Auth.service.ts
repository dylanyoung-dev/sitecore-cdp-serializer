import chalk from 'chalk';
import Configstore from 'configstore';
import fetch, { Response } from 'node-fetch';
import { logError, logSuccess, logline } from '../../../utils/index.js';
import { PersonalizeConfig } from '../../../utils/personalizeConfig.js';
import { AuthToken } from './index.js';

export const AuthService = (config: Configstore, personalizeConfig: PersonalizeConfig) => {
  const { staging } = personalizeConfig;
  const Authenticate = async (clientId: string, clientSecret: string, isCloudPortal: boolean) => {
    const authUrl = config.get('authUrl');

    if (!authUrl) {
      logline(chalk.red('Auth URL not set, re-run auth command'));
    }

    // Authentication is completely different for Cloud Portal
    if (isCloudPortal) {
      await HandleCloudPortalAuthentication(clientId, clientSecret, authUrl, staging);
    } else {
      await HandleBoxeverAuthentication(clientId, clientSecret, authUrl);
    }
  };

  const HandleCloudPortalAuthentication = async (
    clientId: string,
    clientSecret: string,
    authUrl: string,
    isStaging: boolean
  ) => {
    const servicePath = `https://${authUrl}/oauth/token`;

    const params = new URLSearchParams();

    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('audience', 'https://api.sitecorecloud.io');

    const response: Response = await fetch(servicePath, {
      method: 'post',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

      if (authToken) {
        config.set('credentials', authToken);

        logSuccess('Token Stored for future uses');
      }
    } else {
      logError('Authentication Failed');
    }
  };

  const HandleBoxeverAuthentication = async (clientId: string, clientSecret: string, authUrl: string) => {
    const servicePath = `https://${authUrl}/v2/oauth/token`;

    const params = new URLSearchParams();

    params.append('grant_type', 'client_credentials');
    params.append('clientKey', clientId);

    const response: Response = await fetch(servicePath, {
      method: 'post',
      body: params,
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });

    if (response.ok) {
      let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

      if (authToken) {
        config.set('credentials', authToken);

        logSuccess('Token Stored for future uses');
      }
    } else {
      logError('Authentication Failed');
    }
  };
  return { Authenticate };
};
