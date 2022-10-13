import chalk from 'chalk';
import { Response } from 'node-fetch';

const logJson = (message: any = '') => {
  process.stdout.write(JSON.stringify(message, null, 2));
};

const log = (message: any = '', ...args: any[]) => {
  process.stdout.write(message, ...args);
};

const logline = (message: any = '', ...args: any[]) => {
  process.stdout.write(message + '\n', ...args);
};

const logSuccess = (message: any = '') => {
  logline(chalk.green(message));
}

const logError = (message: any = '') => {
  logline(chalk.red(message));
}

const logResponse = async (response: Response, message: any) => {
  if (message) {
    logline(response.ok
      ? chalk.green(message)
      : chalk.red(message)
    );
  }
  logline(JSON.stringify(await response.json()));
};

export {
  logJson,
  log,
  logline,
  logSuccess,
  logError,
  logResponse
};
