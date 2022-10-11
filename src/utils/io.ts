import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const getConfigFile = async <T>(startPath: string) => {
  // Read File Sync by yml yaml or json from the file system
  let extension = getExtensions(startPath, 'config');

  if (extension === undefined) {
    return null;
  }

  let configContents: T = yaml.load(fs.readFileSync(path.join(startPath, `config.${extension}`), 'utf8')) as T;

  return configContents;
};

const getExtensions = (startDirectory: string, fileEntry: string): string | undefined => {
  const files = fs.readdirSync(startDirectory);

  const filename: string | undefined = files.find((file) => {
    // return the first files that include given entry
    return file.includes(fileEntry);
  });

  if (filename === undefined) {
    return undefined;
  }

  const extension = filename.split('.').pop();

  return extension;
};

export { getConfigFile, getExtensions };
