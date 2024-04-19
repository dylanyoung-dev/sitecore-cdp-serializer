import Configstore from 'configstore';
import { Ora } from 'ora';
import { logError } from '../../../utils/index.js';
import { BaseService } from '../Base.service.js';
import { DecisionDefinition } from './Decisions.interface.js';

export const DecisionService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllDecisions = async (spinner: Ora) => {
    try {
      let serviceUrl = 'v2/decisionModelDefinitions';

      const response = await baseService.Get(serviceUrl);

      if (response.ok) {
        let decisions: DecisionDefinition[] = (await response.json()) as DecisionDefinition[];

        spinner.succeed(`Decisions retrieved successfully\n\n${JSON.stringify(decisions, null, 2)}`);

        return decisions;
      } else {
        spinner.fail('Failed to retrieve decisions');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve decisions with error: ${ex}`);
    }
  };

  const GetDecisionDefinitionById = async (id: string, spinner: Ora) => {
    try {
      const response = await baseService.Get(`v2/decisionModelDefinitions/${id}`);

      if (response.ok) {
        let decision: DecisionDefinition = (await response.json()) as DecisionDefinition;

        spinner.succeed('Decision retrieved successfully\n\n' + JSON.stringify(decision, null, 2));

        return decision;
      } else {
        spinner.fail('Failed to retrieve decision');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve decision with error: ${ex}`);
      logError(ex);
    }
  };

  const CreateDecision = async (decision: DecisionDefinition, spinner: Ora) => {};

  const UpdateDecision = async (decision: DecisionDefinition, spinner: Ora) => {};

  return { GetAllDecisions, GetDecisionDefinitionById, CreateDecision, UpdateDecision };
};
