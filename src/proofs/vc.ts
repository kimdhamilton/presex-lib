import { JWT } from "did-jwt-vc/lib/types";
import {
  DidMethods,
  Jwk,
  ProofFormats,
  buildDidJwtIssuerFromJwk,
  didResolver,
} from ".";
import { CredentialPayload_v1_1 } from "../credentials";
import * as DidKit from "@spruceid/didkit-wasm-node";
import { createVerifiableCredentialJwt, verifyCredential } from "did-jwt-vc";

export const ASSERTION_METHOD = "assertionMethod";

export interface VCProvider {
  signCredential(
    method: DidMethods,
    jwk: Jwk,
    format: ProofFormats,
    credential: CredentialPayload_v1_1,
    assertionMethod: string
  ): Promise<JWT>;

  verifyCredential(
    vc: JWT,
    format: ProofFormats,
    assertionMethod: string
  ): Promise<any>;
}

export class DidKitProvider implements VCProvider {
  async signCredential(
    method: DidMethods,
    jwk: Jwk,
    format: ProofFormats,
    credential: CredentialPayload_v1_1,
    assertionMethod: string = ASSERTION_METHOD
  ): Promise<JWT> {
    const keyStr = JSON.stringify(jwk);
    const verificationMethod = await DidKit.keyToVerificationMethod(
      method,
      keyStr
    );

    const issuedCredential = await DidKit.issueCredential(
      JSON.stringify(credential),
      JSON.stringify({
        proofPurpose: assertionMethod,
        proofFormat: format,
        verificationMethod: verificationMethod,
      }),
      keyStr
    );
    return issuedCredential;
  }

  async verifyCredential(
    vc: string,
    format: ProofFormats,
    assertionMethod: string = ASSERTION_METHOD
  ): Promise<any> {
    const result = await DidKit.verifyCredential(
      vc,
      JSON.stringify({
        proofFormat: format,
        verificationMethod:
          "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a#blockchainAccountId",
        //did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a#blockchainAccountId
      })
    );
    return result;
  }
}

export class DidJwtVcProvider implements VCProvider {
  DidJwtVcProvider() {}

  async signCredential(
    method: DidMethods,
    jwk: Jwk,
    format: ProofFormats,
    credential: CredentialPayload_v1_1,
    assertionMethod: string
  ): Promise<JWT> {
    const issuer = buildDidJwtIssuerFromJwk(jwk, method);
    return createVerifiableCredentialJwt(credential, issuer, {});
  }

  verifyCredential(
    vc: JWT,
    format: ProofFormats,
    assertionMethod: string
  ): Promise<any> {
    return verifyCredential(vc, didResolver, {});
  }
}
