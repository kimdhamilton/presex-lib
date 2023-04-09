import { PresentationPayload, W3CPresentation } from "did-jwt-vc";
import { PresentationSubmission } from ".";

export interface PresentationSubmissionWrapper extends PresentationPayload {
  presentation_submission: PresentationSubmission;
}
