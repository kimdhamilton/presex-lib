import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "lodash";

import { Verifiable, VerifiableCredential, W3CCredential } from "did-jwt-vc";
import { PresentationSubmissionWrapperBuilder } from "..";
import { PresentationDefinitionBuilder } from "../builders";
import {
  ACTIVE_STATUS_CONSTRAINT,
  schemaConstraint,
  trustedIssuerConstraint,
} from "./helpers";
import {
  DescriptorMapEntry,
  PresentationDefinition,
  PresentationSubmissionWrapper,
} from "../types";

// TODO: https://w3c.github.io/vc-json-schema/
const schema =
  "https://raw.githubusercontent.com/centrehq/verite/main/packages/docs/static/definitions/schemas/0.0.1/KYCAMLAttestation";

export function buildPresentationDefinitionFromSchema(
  schemaUri: string,
  credentialType: string,
  definitionId: string = uuidv4(),
  ...trustedIssuers: string[]
): PresentationDefinition {
  // loader lookup
  //let schema: CredentialSchema2022 // TODO: lookup from URI

  const builder = new PresentationDefinitionBuilder(definitionId)
    .startInputDescriptor()
    .id(credentialType)
    .name(`Proof of ${credentialType}`)
    .purpose(
      `Please provide a valid credential from a ${credentialType} issuer`
    )
    .startConstraints()
    .addField(schemaConstraint(schemaUri))
    .statuses(ACTIVE_STATUS_CONSTRAINT);
  if (!isEmpty(trustedIssuers)) {
    builder.addField(trustedIssuerConstraint(...trustedIssuers));
  }
  return builder.endConstraints().endInputDescriptor().build();
}

export function buildPresentationSubmission(
  presentationDefinition: PresentationDefinition,
  holder: string,
  verifiableCredential: VerifiableCredential,
  id: string = uuidv4()
): PresentationSubmissionWrapper {
  const ds =
    presentationDefinition.input_descriptors.map((d, i) => {
      return {
        id: d.id,
        format: "jwt_vc",
        path: `$.verifiableCredential[${i}]`,
      } as DescriptorMapEntry;
    }) ?? [];

  const submissionWrapper = new PresentationSubmissionWrapperBuilder()
    .verifiableCredential(verifiableCredential)
    .holder(holder)
    .startPresentationSubmission()
    .id(id)
    .definitionId(presentationDefinition.id)
    .descriptorMap(...ds)
    .endPresentationSubmission()
    .build();

  return submissionWrapper;
}
