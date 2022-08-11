interface DecisionDefinition {
  clientKey?: string;
  href?: string;
  ref?: string;
  name: string;
  revision: number;
  archived: boolean;
  deploymentConfiguration: DeploymentConfiguration;
  tags: string[];
  variants: {
    href: string;
  };
  revisions: {
    href: string;
  };
  sampleSizeCConfig: {
    baseValue: string;
    minimumDetectableEffect: string;
    confidenceLevel: string;
  };
}

interface DeploymentConfiguration {
  name: string;
}

interface Variant {
  name: string;
}

interface Revision {
  name: string;
}
