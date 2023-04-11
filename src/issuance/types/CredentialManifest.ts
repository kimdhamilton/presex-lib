import { Issuer } from ".";
import { ClaimFormatDesignations, PresentationDefinition } from "../../exchange";
import { OutputDescriptor } from "./OutputDescriptor";

export interface CredentialManifest {
  id: string;
  name?: string;
  description?: string;
  spec_version: string;
  issuer: Issuer;
  output_descriptors: OutputDescriptor[];
  format?: ClaimFormatDesignations;
  presentation_definition?: PresentationDefinition;
}
