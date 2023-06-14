export interface OfferTemplate {
    clientKey?: string;
    href?: string;
    ref?: string;
    name: string;
    description: string;

    createdBy: string;
    createdAt: string;
    modifiedAt?: string;
    modifiedBy: string;
    status: string;

    id: string;
    numberOfOffers: number,    
    
    attributes: Attributes[];
    contexts: string[];
    tags: string[];
    archived: boolean
  }

  export interface Attributes {
    name: string;
    type: string;
  }