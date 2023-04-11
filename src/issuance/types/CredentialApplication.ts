import { ClaimFormatDesignations, PresentationSubmission } from "../../exchange";

export interface CredentialApplication {
  id: string;
  spec_version: string;
  manifest_id: string;
  format?: Partial<ClaimFormatDesignations>;
  presentation_submission?: PresentationSubmission;
}
