import chalk from 'chalk';
import Configstore from 'configstore';
import fs from 'fs';
import yaml from 'js-yaml';
import { diffString } from 'json-diff';
import path from 'path';
import { Template } from '../../commands/api/templates/Template.interface.js';
import { TemplateService } from '../../commands/api/templates/Template.service.js';
import { TemplateType } from '../../commands/api/templates/TemplateType.js';
import { logError, logline } from '../command-helpers.js';
import { checkFolder, getFolders } from './helpers.js';

const deployTemplates = async (artifactDirectory: string, templateType: TemplateType, config: Configstore) => {
  const templateService = TemplateService(config);
  const templateFolder = path.join(artifactDirectory, 'templates');

  logline(chalk.greenBright(`Starting to deploy templates`));

  if (!(await checkFolder(templateFolder))) {
    logError(`Templates folder doesn't exist - will not deploy`);
    return;
  }

  const templateFolderTypes: string[] = await getFolders(templateFolder);

  if (templateFolderTypes.length === 0) {
    logError(`No templates found - will not deploy`);
    return;
  }

  if (templateType === TemplateType.All) {
    for (let template of Object.values(TemplateType)) {
      // skip
      if (template === TemplateType.All) {
        continue;
      }

      await deployTemplateTypes(artifactDirectory, template, config);
    }
  } else {
    // check if param passed in exists as a template type
    if (!Object.values(TemplateType).includes(templateType)) {
      logError(`Template ${templateType} is not valid`);
      return;
    }

    await deployTemplateTypes(artifactDirectory, templateType, config);
  }

  logline(chalk.greenBright(`Finished deploying templates`));
};

const deployTemplateTypes = async (
  artifactDirectory: string,
  templateType: string,
  config: Configstore
): Promise<void> => {
  const templateService = TemplateService(config);
  const templateFolder = path.join(artifactDirectory, 'templates', templateType.toLowerCase());
  const clientKey: string = config.get('clientKey');

  // todo: implement offer templates
  // currently deploying of offer templates is blocked as the POST/PUT API
  // is not authorized for public tokens
  if (templateType === TemplateType.Offer) {
    return;
  }

  if (!(await checkFolder(templateFolder))) {
    logError(`${templateType} templates folder doesn't exist - will not deploy`);
    return;
  }

  logline(chalk.greenBright(`Starting to deploy ${templateType} templates`));

  const templatesToRun: string[] = await getFolders(templateFolder);

  if (templatesToRun.length === 0) {
    logError(`No ${templateType} templates found - will not deploy`);
  }

  await Promise.all(
    templatesToRun.map(
      async (templateToRun) =>
        await deployIndividualTemplates(templateToRun, templateFolder, templateType, templateService)
    )
  );

  logline(chalk.greenBright(`Finished deploying ${templateType} templates`));
};

const getConfigFile = async (startPath: string) => {
  // Read File Sync by yml yaml or json from the file system
  let extension = getExtensions(startPath, 'config');

  if (extension === undefined) {
    return null;
  }

  let configContents: Template = yaml.load(
    fs.readFileSync(path.join(startPath, `config.${extension}`), 'utf8')
  ) as Template;

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

const generateTemplateElements = (template: Template, startDirectory: string, templateType: string): Template => {
  const files = fs.readdirSync(startDirectory);

  if (!files) {
    return template;
  }

  const filenames: string[] = files.filter((value) => value.match(/file.(js|html|css|ftl)/));

  if (filenames.length > 0) {
    // If empty array, then initialize
    if (template.templateElements == undefined || template.templateElements.length == 0) {
      template.templateElements = [];
    }

    filenames.forEach((file, item) => {
      let fileContents = fs.readFileSync(path.join(startDirectory, file), 'utf8');
      let extension = file.split('.').pop();

      if (extension == 'ftl') {
        extension = 'freemarker';
      }

      if (fileContents && extension) {
        let existingElement = template.templateElements.findIndex((element) => element.id == extension);

        if (existingElement > -1) {
          template.templateElements[existingElement].template = fileContents;
        } else {
          template.templateElements.push({ id: extension, template: fileContents });
        }
      } else {
        logline(`There was an issue attaching file ${file} to ${template.name}`);
      }
    });
  }

  return template;
};

const deployIndividualTemplates = async (
  templateToRun: string,
  folderPath: string,
  templateType: string,
  templateService: any
) => {
  let template: Template | null = await getConfigFile(path.join(folderPath, templateToRun));

  if (template != null) {
    let result: Template | null = null;

    const templateFromService: Template = await templateService.GetByFriendlyId(template.friendlyId);

    template = generateTemplateElements(template, path.join(folderPath, templateToRun), templateType);

    if (templateFromService) {
      logline(chalk.greenBright(`Template ${template.friendlyId} already exists in tenant - will update values`));

      let compareTemplate = template;

      compareTemplate.ref = templateFromService.ref;
      compareTemplate.clientKey = templateFromService.clientKey;
      compareTemplate.href = templateFromService.href;
      compareTemplate.modifiedAt = templateFromService.modifiedAt;
      compareTemplate.revision = templateFromService.revision;
      compareTemplate.revisionComment = templateFromService.revisionComment;
      compareTemplate.modifiedByRef = templateFromService.modifiedByRef;

      const jsonMatch = diffString(templateFromService, compareTemplate, { raw: false });

      if (jsonMatch.length > 6) {
        // Differences exist, need to set template to draft and update
        logline(chalk.yellowBright(`Template ${template.friendlyId} has differences - will update`));

        compareTemplate.status = 'DRAFT';

        result = await templateService.UpdateTemplate(compareTemplate);

        if (result) {
          // Now Update
          template.status = 'PUBLISHED';

          result = await templateService.UpdateTemplate(template);
        }
      } else {
        logline(chalk.yellowBright(`No differences found - will not update template`));
      }
    } else {
      logline(chalk.greenBright(`Template ${template.friendlyId} does not exist in the tenant - will create`));

      // template.status = 'PUBLISHED';

      // logline(JSON.stringify(template));
      result = await templateService.CreateTemplate(template);

      if (result != null) {
        logline(chalk.greenBright(`Template ${template.friendlyId} successfully deployed`));
      }
    }
  }
};

export { deployTemplates };
