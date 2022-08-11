const logJson = (message: any = '') => {
  process.stdout.write(JSON.stringify(message, null, 2));
};

const log = (message: any = '', ...args: any[]) => {
  process.stdout.write(message, ...args);
};

const logline = (message: any = '', ...args: any[]) => {
  process.stdout.write(message + '\n', ...args);
};

export { logJson, log, logline };
