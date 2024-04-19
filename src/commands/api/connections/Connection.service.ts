import Configstore from 'configstore';
import { Ora } from 'ora';
import { BaseService } from '../Base.service.js';
import { ResponseCollection } from '../Common.interface.js';
import { Connection } from './index.js';

export const ConnectionService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllConnections = async (spinner: Ora) => {
    try {
      let servicePath = `v2/connections`;

      const response = await baseService.Get(servicePath);

      if (response.ok) {
        let connections = (await response.json()) as ResponseCollection<Connection>;

        spinner.succeed(`Connections retrieved successfully\n\n${JSON.stringify(connections, null, 2)}`);

        return connections;
      } else {
        spinner.fail('Failed to retrieve connections');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve connections with error: ${ex}`);
    }
  };

  const GetConnectionByRef = async (connectionRef: string, spinner: Ora) => {
    try {
      let servicePath = `v2/connections/${connectionRef}`;

      const response = await baseService.Get(servicePath);

      if (response.ok) {
        let connection = (await response.json()) as Connection;

        spinner.succeed(`Connection retrieved successfully\n\n${JSON.stringify(connection, null, 2)}`);

        return connection;
      } else {
        spinner.fail('Failed to retrieve connection');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve connection with error: ${ex}`);
    }
  };

  return { GetAllConnections, GetConnectionByRef };
};
