import { CredentialPayloadBuilder } from "..";
import { CREDENTIAL_SCHEMA_2022_TYPE } from "../../constants";
import { CredentialStatus, CredentialSubject } from "../../types";

export function buildCredentialPayload(
  issuerDid: string,
  credentialType: string,
  credentialSchema: string,
  credentialSubject: CredentialSubject,
  credentialStatus?: CredentialStatus
) {
  let vcBuilder = new CredentialPayloadBuilder()
    .issuer(issuerDid)
    .type(credentialType)
    .credentialSubject(credentialSubject)
    .credentialSchema({
      id: credentialSchema,
      type: CREDENTIAL_SCHEMA_2022_TYPE,
    });

  if (credentialStatus) {
    vcBuilder = vcBuilder.credentialStatus(credentialStatus);
  }
  return vcBuilder.build();
}
