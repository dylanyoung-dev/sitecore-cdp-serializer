import { TemplateType } from '../api/templates/TemplateType.js';

export interface DeployProps {
  artifactPath: string;
  templateType: TemplateType;
}
