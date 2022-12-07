import Configstore from 'configstore';
import { Command } from 'commander';
import {
  OfferTemplate,
  Offer,
} from "./Offer.interface.js";
import { OfferService } from './Offer.service.js';
import { logline } from '../../../utils/index.js';

const initOfferCommands = (program: Command, config: Configstore) => {
  const offerService = OfferService(config);

  const offerTemplateCommands = program
    .command('offerTemplates')
    .description('List all offer templates')
    .action(async () => {
      let templates: OfferTemplate[] | undefined = await offerService.GetAllOfferTemplates();

      if (templates) {
        logline(JSON.stringify(templates, null, 2));
      }
    });

  // Nested (Sub) Commands
  offerTemplateCommands
    .command('get')
    .option('--id <id>', 'id of the offer template to retrieve')
    .description('Get a single template')
    .action(async (options) => {
      let template: OfferTemplate | null = null;
      if (options.id) {
        template = await offerService.GetOfferTemplatesById(options.id);
      }

      if (template !== null) {
        logline(JSON.stringify(template, null, 2));
      }
    });

  // #region offers
  const offerCommands = program
    .command('offers')
    .description('List all offers')
    .action(async () => {
      let offers: Offer[] | undefined = await offerService.GetAllOffers();

      if (offers) {
        logline(JSON.stringify(offers, null, 2));
      }
    });

  offerCommands
    .command('get')
    .requiredOption('-r, --ref <ref>', 'ref of the offer')
    .description('Get a single offer')
    .action(async (options) => {
      let offer: Offer | null = null;
      if (options.ref) {
        offer = await offerService.GetOfferByRef(options.ref);
      }

      if (offer !== null) {
        logline(JSON.stringify(offer, null, 2));
      }
    });
  // #endregion offers 
};

export { initOfferCommands }