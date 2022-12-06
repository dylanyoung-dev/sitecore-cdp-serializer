import Configstore from "configstore";
import { Response } from 'node-fetch';
import { BaseService } from '../Base.service.js'
import {
  logSuccess,
  logError,
  logResponse,
} from '../../../utils/index.js';
import { OfferTemplate } from "./OfferTemplate.interface.js";
import { BaseResponse } from "../BaseResponse.interface.js";

export const OfferService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllOfferTemplates = async() => {
    try {
      const response: Response = await baseService.Get('v3/offerTemplates');
  
      if (response.ok) {
        logSuccess('success');
        let responseJson = await response.json() as BaseResponse;
    
        return responseJson.items as OfferTemplate[];
      } else {
        logResponse(response, 'Failed to retrieve offer templates');
      }
    } catch (ex) {
        logError(ex);
    }
  };

  const GetById = async (id: string): Promise<OfferTemplate | null> => {
    try {
      const response: Response = await baseService.Get(`v3/offerTemplates/${id}`);

      if (response.ok) {
        const result: OfferTemplate = (await response.json()) as OfferTemplate;
        logSuccess('Template retrieved successfully');

        return result;
      } else {
        logResponse(response, 'Failed to retrieve template');
        return null;
      }
    } catch (ex) {
      logError(ex);
    }

    return null;
  };

  return {
    GetAllOfferTemplates,
    GetById
  }
}