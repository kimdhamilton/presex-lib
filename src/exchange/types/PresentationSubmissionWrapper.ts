import { W3CPresentation } from "did-jwt-vc";
import { PresentationSubmission } from ".";

export type PresentationSubmissionWrapper = W3CPresentation & {
  presentation_submission: PresentationSubmission;
};
