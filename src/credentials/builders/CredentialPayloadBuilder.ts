import {
  CredentialSchema,
  RefreshService,
  CredentialPayload_v1_1,
  CredentialSubjectSchema,
  CredentialSubject,
} from "../types";
import { DEFAULT_CONTEXT, VERIFIABLE_CREDENTIAL_TYPE_NAME } from "../constants";
import { CredentialStatus } from "../types";

export interface CredentialSubjectBuilder {
  init(): CredentialSubjectBuilder;
  build(): CredentialSubjectSchema;
}

// TODO: is this Payload or Credential?
export class CredentialPayloadBuilder {
  _data: Partial<CredentialPayload_v1_1>;

  constructor() {
    this._data = {
      "@context": DEFAULT_CONTEXT,
      type: VERIFIABLE_CREDENTIAL_TYPE_NAME,
    };
  }

  id(id: string): CredentialPayloadBuilder {
    this._data.id = id;
    return this;
  }

  type(...type: string[]): CredentialPayloadBuilder {
    // append all types other than "VerifiableCredential", which we always include
    const filteredCredentialTypes = type.filter(
      (t) => t !== VERIFIABLE_CREDENTIAL_TYPE_NAME
    );
    this._data.type = [
      VERIFIABLE_CREDENTIAL_TYPE_NAME,
      ...filteredCredentialTypes,
    ];
    return this;
  }

  credentialSubject(
    credentialSubject: CredentialSubject
  ): CredentialPayloadBuilder {
    this._data.credentialSubject = credentialSubject;
    return this;
  }

  issuer(issuerDid: string): CredentialPayloadBuilder {
    this._data.issuer = { id: issuerDid };
    return this;
  }

  credentialSchema(
    credentialSchema: CredentialSchema
  ): CredentialPayloadBuilder {
    this._data.credentialSchema = credentialSchema;
    return this;
  }

  credentialStatus(
    credentialStatus: CredentialStatus
  ): CredentialPayloadBuilder {
    this._data.credentialStatus = credentialStatus;
    return this;
  }

  refreshService(refreshService: RefreshService): CredentialPayloadBuilder {
    this._data.refreshService = refreshService;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidence(evidence: any[]): CredentialPayloadBuilder {
    this._data.evidence = evidence;
    return this;
  }

  issuanceDate(issuanceDate: Date | string): CredentialPayloadBuilder {
    this._data.issuanceDate = issuanceDate;
    return this;
  }

  expirationDate(expirationDate: Date | string): CredentialPayloadBuilder {
    this._data.expirationDate = expirationDate;
    return this;
  }

  build(): CredentialPayload_v1_1 {
    if (!this._data.issuanceDate) {
      this._data.issuanceDate = new Date();
    }
    return this._data as CredentialPayload_v1_1;
  }
}
