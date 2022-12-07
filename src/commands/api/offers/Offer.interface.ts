export interface Offer {
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
  offerTypeRef: string;
  propensity: number;
  offerTemplateDTO: HrefProp;
  
  attributes: any[];
  contexts: string[];
  tags: string[];
  archived: boolean
}

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

export interface HrefProp {
  href: string;
  archived: boolean;
}