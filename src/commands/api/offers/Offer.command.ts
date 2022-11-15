import Configstore from 'configstore';
import { Command } from 'commander';
import { OfferTemplate } from "./OfferTemplate.interface.js";
import { OfferService } from './Offer.service.js';
import { logline } from '../../../utils/index.js';

const initOfferCommands = (program: Command, config: Configstore) => {
  const offerService = OfferService(config);

  logline('initoffer');
  const offerCommands = program
    .command('offer')
    .description('List all offer templates')
    .action(async () => {
      let templates: OfferTemplate[] | undefined = await offerService.GetAllOfferTemplates();

      if (templates) {
        logline(JSON.stringify(templates, null, 2));
      }
    });

  // Nested (Sub) Commands
  offerCommands
    .command('gett')
    .option('--id <idt>', 'id of the offer template to retrieve')
    .description('Get a single template')
    .action(async (options) => {
      let template: OfferTemplate | null = null;
      if (options.id) {
        template = await offerService.GetById(options.id);
      }

      if (template !== null) {
        logline(JSON.stringify(template, null, 2));
      }
    });

    // offerCommands
    // .command('create')
    // .requiredOption('-t, --template <template>', 'Template to create')
    // .description('Create a new template')
    // .action(async (options) => {
    //   await offerService.CreateTemplate(options.template);
    // });

    // offerCommands
    // .command('templates update')
    // .requiredOption('-t, --template <template>', 'Template to update')
    // .description('Update a template')
    // .action(async (options) => {
    //   await offerService.UpdateTemplate(options.template);
    // });

  return offerCommands;
};

export { initOfferCommands }