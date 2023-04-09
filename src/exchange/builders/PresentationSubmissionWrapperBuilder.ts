import { Verifiable, VerifiableCredential, W3CCredential } from "did-jwt-vc";
import {
  PresentationSubmission,
  PresentationSubmissionWrapper,
} from "../types";
import { PresentationSubmissionBuilder } from ".";
import {
  VC_CONTEXT_URI,
  VERIFIABLE_PRESENTATION_TYPE_NAME,
} from "../../credentials/constants";

export const PRESENTATION_SUBMISSION_TYPE_NAME = "PresentationSubmission";

export class PresentationSubmissionWrapperBuilder {
  private _data: Partial<PresentationSubmissionWrapper> = {
    "@context": [VC_CONTEXT_URI],
    type: [
      VERIFIABLE_PRESENTATION_TYPE_NAME,
      PRESENTATION_SUBMISSION_TYPE_NAME,
    ],
  };

  id(id: string): PresentationSubmissionWrapperBuilder {
    this._data.id = id;
    return this;
  }

  verifiableCredential(
    ...verifiableCredential: VerifiableCredential[]
  ): PresentationSubmissionWrapperBuilder {
    const vcPayload = Array.isArray(verifiableCredential)
      ? verifiableCredential
      : [verifiableCredential];
    this._data.verifiableCredential = vcPayload;
    return this;
  }

  holder(holder: string): PresentationSubmissionWrapperBuilder {
    this._data.holder = holder;
    return this;
  }

  presentation_submission(
    presentation_submission: PresentationSubmission
  ): PresentationSubmissionWrapperBuilder {
    this._data.presentation_submission = presentation_submission;
    return this;
  }

  /**
   * Enables fluent creatiion of Presentation Submission through nested builders. When complete, call
   * endPresentationSubmission()
   * @returns
   */
  startPresentationSubmission(): PresentationSubmissionBuilder<this> {
    return new PresentationSubmissionBuilder(this);
  }

  issuanceDate(issuanceDate: string): PresentationSubmissionWrapperBuilder {
    this._data.issuanceDate = issuanceDate;
    return this;
  }

  expirationDate(expirationDate: string): PresentationSubmissionWrapperBuilder {
    this._data.expirationDate = expirationDate;
    return this;
  }

  build(): PresentationSubmissionWrapper {
    return this._data as PresentationSubmissionWrapper;
  }
}
