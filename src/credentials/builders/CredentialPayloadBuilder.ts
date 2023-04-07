import {
  CredentialSchema,
  RefreshService,
  CredentialPayload_v1_1,
  CredentialSubjectSchema,
} from "../types";
import { DEFAULT_CONTEXT, VERIFIABLE_CREDENTIAL_TYPE_NAME } from "../constants";
import { CredentialStatus } from "../types";

export interface CredentialSubjectBuilder {
  init(): CredentialSubjectBuilder;
  build(): CredentialSubjectSchema;
}

export class CredentialPayloadBuilder {
  _builder: Partial<CredentialPayload_v1_1>;

  constructor() {
    this._builder = {
      "@context": DEFAULT_CONTEXT,
      type: VERIFIABLE_CREDENTIAL_TYPE_NAME,
    };
  }
  // TODO: id

  type(...type: string[]): CredentialPayloadBuilder {
    // append all types other than "Verifiable Credential", which we always include
    const filteredCredentialTypes = type.filter(
      (t) => t !== VERIFIABLE_CREDENTIAL_TYPE_NAME
    );
    this._builder.type = [
      VERIFIABLE_CREDENTIAL_TYPE_NAME,
      ...filteredCredentialTypes,
    ];
    return this;
  }

  credentialSubject(
    credentialSubject: CredentialSubjectSchema
  ): CredentialPayloadBuilder {
    this._builder.credentialSubject = credentialSubject;
    return this;
  }

  issuer(issuerDid: string): CredentialPayloadBuilder {
    this._builder.issuer = { id: issuerDid };
    return this;
  }

  credentialSchema(
    credentialSchema: CredentialSchema
  ): CredentialPayloadBuilder {
    this._builder.credentialSchema = credentialSchema;
    return this;
  }

  credentialStatus(
    credentialStatus: CredentialStatus
  ): CredentialPayloadBuilder {
    this._builder.credentialStatus = credentialStatus;
    return this;
  }

  refreshService(refreshService: RefreshService): CredentialPayloadBuilder {
    this._builder.refreshService = refreshService;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidence(evidence: any[]): CredentialPayloadBuilder {
    this._builder.evidence = evidence;
    return this;
  }

  issuanceDate(issuanceDate: Date | string): CredentialPayloadBuilder {
    this._builder.issuanceDate = issuanceDate;
    return this;
  }

  expirationDate(expirationDate: Date | string): CredentialPayloadBuilder {
    this._builder.expirationDate = expirationDate;
    return this;
  }

  build(): CredentialPayload_v1_1 {
    if (!this._builder.issuanceDate) {
      this._builder.issuanceDate = new Date();
    }
    return this._builder as CredentialPayload_v1_1;
  }
}
