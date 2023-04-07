import { CredentialPayload } from "did-jwt-vc";

export interface RefreshService {
  id: string;
  type: string;
}

// TODO: name makes this confusing with file CredentialSChema. Fix this
export interface CredentialSchema {
  id: string;
  type: string;
}

export type ContextType = string | string[] | any[];

export type CredentialSubject = Record<string, any>;

export interface CredentialPayload_v1_1 extends CredentialPayload {
  "@context": ContextType;
  credentialSubject: CredentialSubject;
  credentialSchema?: CredentialSchema;
  refreshService?: RefreshService;
}
