import { ClaimFormatDesignations, InputDescriptorConstraints } from ".";

export interface InputDescriptor {
  id: string;
  name?: string;
  purpose?: string;
  group?: string[];
  constraints: InputDescriptorConstraints;
  format?: ClaimFormatDesignations;
}
