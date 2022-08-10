import Configstore from 'configstore';
import { AuthToken } from './Auth.interface.js';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';

interface AuthenticateProps {
  username: string;
  password: string;
  config: Configstore;
}

const Authenticate = async (authDetails: AuthenticateProps) => {
  const serviceUrl = authDetails.config.get('serviceUrl');

  if (!serviceUrl) {
    console.log(chalk.red('Service URL not set, re-run auth command'));
  }

  const servicePath = `https://${serviceUrl}/v2/oauth/token`;

  const params = new URLSearchParams();

  params.append('grant_type', 'password');
  params.append('username', authDetails.username);
  params.append('password', authDetails.password);

  console.log(chalk.green('Authenticating...'));

  const response: Response = await fetch(servicePath, {
    method: 'post',
    body: params,
  });

  if (response.ok) {
    // Store Details in Config for Persistence
    let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

    console.log(chalk.green('Successfully Authenticated'));

    if (authToken) {
      authDetails.config.set('credentials', authToken);

      console.log(chalk.green('Token Stored for future uses'));
    }
  } else {
    console.log(chalk.red('Authentication Failed'));
  }
};

export { Authenticate, AuthenticateProps };
