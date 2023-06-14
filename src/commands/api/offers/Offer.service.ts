import Configstore from "configstore";
import { Response } from 'node-fetch';
import { BaseService } from '../Base.service.js'
import {
  logSuccess,
  logError,
  logResponse,
} from '../../../utils/index.js';
import {
  OfferTemplate,
  Offer,
} from "./Offer.interface.js";
import { BaseResponse } from "../BaseResponse.interface.js";

export const OfferService = (config: Configstore) => {
  const baseService = BaseService(config);

  // #region Offer Templates
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

  const GetOfferTemplatesById = async (id: string): Promise<OfferTemplate | null> => {
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
  // #endregion

  // #region Offers
  const GetAllOffers = async() => {
    try {
      const response: Response = await baseService.Get('v3/offers');
  
      if (response.ok) {
        let responseJson = await response.json() as BaseResponse;
    
        return responseJson.items as Offer[];
      } else {
        logResponse(response, 'Failed to retrieve offers');
      }
    } catch (ex) {
        logError(ex);
    }
  };

  const GetOfferByRef = async(ref:string) : Promise<Offer | null> => {
    try {
      const response: Response = await baseService.Get(`v3/offers/${ref}`);
  
      if (response.ok) {
        return await response.json() as Offer;
      } else {
        logResponse(response, `Failed to retrieve offer ${ref}`);
      }
    } catch (ex) {
        logError(ex);
    }
    return null;
  };

  // currently unsupported
  // const CreateOffer = async (offer: Offer): Promise<Offer | null> => {
  //   try {
  //     const response: Response = await baseService.Post('v3/offer', offer);

  //     if (response.ok) {
  //       const result: Offer = (await response.json()) as Offer;

  //       return result;
  //     } else {
  //       logResponse(response, 'Failed to create offer');
  //       return null;
  //     }
  //   } catch (ex) {
  //     logError(ex);
  //   }
    
  //   return null;
  // };

  // const UpdateOffer = async (offer: Offer): Promise<Offer | null> => {
  //   try {
  //     const response: Response = await baseService.Put(`v3/offer/${offer.ref}`, offer);

  //     if (response.ok) {
  //       const result: Offer = (await response.json()) as Offer;

  //       return result;
  //     } else {
  //       logResponse(response, 'Failed to update offer');
  //       return null;
  //     }
  //   } catch (ex) {
  //     logError(ex);
  //   }

  //   return null;
  // };

  // #endregion

  return {
    GetAllOfferTemplates,
    GetOfferTemplatesById,
    GetAllOffers,
    GetOfferByRef,
  }
}