export interface DecisionDefinition {
  clientKey?: string;
  href?: string;
  ref?: string;
  name: string;
  revision?: number;
  archived: boolean;
  deploymentConfiguration: DeploymentConfiguration;
  tags?: string[];
  variants: {
    href: string;
  };
  revisions: {
    href: string;
  };
  inProduction: boolean;
  offers?: string[];
  sampleSizeCConfig: {
    baseValue: string;
    minimumDetectableEffect: string;
    confidenceLevel: string;
  };
}

export interface DeploymentConfiguration {
  name: string;
}

export interface Variant {
  name: string;
}

export interface Revision {
  name: string;
}
