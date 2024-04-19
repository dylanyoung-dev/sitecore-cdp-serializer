export interface Connection {
  clientKey?: string;
  href?: string;
  ref?: string;
  name: string;
  description: string;
  modifiedByRef: string;
  modifiedAt: string;
  revision: number;
  archived: boolean;
  auth: AuthType;
  request: RequestType;
  inputMappings?: InputMapping[];
  outputMappings?: OutputMapping[];
  customHeaders?: CustomHeader[];
  urlParameters?: UrlParameter[];
  systemType: string;
  connectionTimeout: number;
  socketTimeout: number;
  icon: string;
}

export interface AuthType {
  authType: string;
}

export interface RequestType {
  requestType: string;
  connectionUrl: string;
  requestBody: string;
}

export interface InputMapping {}

export interface OutputMapping {
  label: string;
  outputReference: string;
  type: string;
}

export interface CustomHeader {
  name: string;
  value: string;
}

export interface UrlParameter {}
