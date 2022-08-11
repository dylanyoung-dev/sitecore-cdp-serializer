interface Connection {
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

interface AuthType {
  authType: string;
}

interface RequestType {
  requestType: string;
  connectionUrl: string;
  requestBody: string;
}

interface InputMapping {}

interface OutputMapping {
  label: string;
  outputReference: string;
  type: string;
}

interface CustomHeader {
  name: string;
  value: string;
}

interface UrlParameter {}

export {
  Connection,
  AuthType,
  RequestType,
  InputMapping,
  OutputMapping,
  CustomHeader,
  UrlParameter,
};
