import { Command } from 'commander';
import Configstore from 'configstore';
import { BaseService } from '../Base.service.js';
import { logError, logResponse, logSuccess, logline } from '../../../utils/index.js';
import { DecisionDefinition } from './Decisions.interface.js';

const DecisionService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllDecisions = async () => {
    try {
      let serviceUrl = 'v2/decisionModelDefinitions';

      const response = await baseService.Get(serviceUrl);

      if (response.ok) {
        logSuccess('success');
        let decisions: DecisionDefinition[] = (await response.json()) as DecisionDefinition[];

        if (decisions) {
          logline(JSON.stringify(decisions, null, 2));
        }

        return decisions;
      } else {
        logResponse(response, 'Failed to retrieve decisions');
      }
    } catch (ex) {
      logError(ex);
    }
  };

  return { GetAllDecisions };
};

const initDecisionCommands = (program: Command, config: Configstore) => {
  const decisionService = DecisionService(config);

  const decisionCommands = program
    .command('decisions')
    .description('List all Decisions')
    .action(async (options) => {
      await decisionService.GetAllDecisions();
    });
};

export { initDecisionCommands, DecisionService };
