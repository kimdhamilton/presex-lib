import {
  ClaimFormatDesignations,
  InputDescriptor,
  SubmissionRequirement,
} from ".";

export interface PresentationDefinition {
  id: string;
  name?: string;
  purpose?: string;
  format?: ClaimFormatDesignations;
  frame?: Record<string, unknown>;
  submission_requirements?: SubmissionRequirement[];
  input_descriptors: InputDescriptor[];
}
