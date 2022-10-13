import chalk from 'chalk';
import fs from 'fs';
import { logline } from '../command-helpers.js';

const checkFolder = async (folder: string): Promise<boolean> => {
  try {
    await fs.promises.access(folder);
    return true
  } catch (ex) {}

  return false;
};

const getFolders = async (folder: string): Promise<string[]> => {
  // check if directory exists
  if (!(await checkFolder(folder))) {
    return [];
  }

  const folders = await (await fs.promises.readdir(folder, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  return folders;
};

const getFolderFiles = async (folder: string): Promise<string[]> => {
  // check if directory exists
  if (!(await checkFolder(folder))) {
    return [];
  }

  const files = await (await fs.promises.readdir(folder, { withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => d.name);

  return files;
};

export { checkFolder, getFolders, getFolderFiles };
