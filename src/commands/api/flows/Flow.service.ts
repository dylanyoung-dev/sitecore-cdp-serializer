import Configstore from 'configstore';
import { Ora } from 'ora';
import { BaseService } from '../Base.service.js';
import { ResponseCollection } from '../Common.interface.js';
import { FlowDefinition } from './Flow.interface.js';

export const FlowService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllFlows = async (spinner: Ora) => {
    try {
      let servicePath = `v3/flowDefinitions`;

      const response = await baseService.Get(servicePath);

      if (response.ok) {
        let flows = (await response.json()) as ResponseCollection<FlowDefinition>;

        spinner.succeed(`Flows retrieved successfully\n\n${JSON.stringify(flows, null, 2)}`);

        return flows;
      } else {
        spinner.fail('Failed to retrieve flows');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve flows with error: ${ex}`);
    }
  };

  const GetFlow = async (flowId: string, spinner: Ora) => {
    try {
      let servicePath = `v3/flowDefinitions/${flowId}`;

      const response = await baseService.Get(servicePath);

      if (response.ok) {
        let flow = (await response.json()) as FlowDefinition;

        spinner.succeed(`Flow retrieved successfully\n\n${JSON.stringify(flow, null, 2)}`);

        return flow;
      } else {
        spinner.fail('Failed to retrieve flow');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve flow with error: ${ex}`);
    }
  };

  const CreateFlowDefinition = async (flow: FlowDefinition, spinner: Ora) => {};

  const UpdateFlowDefinition = async (flow: FlowDefinition, spinner: Ora) => {};

  return { GetAllFlows, GetFlow, CreateFlowDefinition };
};
