import { W3CPresentation } from "did-jwt-vc";
import { PresentationSubmission } from ".";

export interface PresentationSubmissionWrapper extends W3CPresentation {
  presentation_submission: PresentationSubmission;
}
