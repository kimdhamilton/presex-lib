import { JWT, VerifiedCredential } from "did-jwt-vc/lib/types";
import {
  DidMethods,
  Jwk,
  ProofFormats,
  buildDidJwtIssuerFromJwk,
  decodeJwt,
  didResolver,
} from ".";
import { CredentialPayload_v1_1 } from "../credentials";
import * as DidKit from "@spruceid/didkit-wasm-node";
import { createVerifiableCredentialJwt, verifyCredential } from "did-jwt-vc";
import { DIDResolutionResult, VerificationMethod } from "did-resolver";

export const ASSERTION_METHOD = "assertionMethod";

interface ProofOptions {
  method?: DidMethods
  format?: ProofFormats
  assertionMethod?: string
  verificationMethod?: any
}

// TODO: see if there are ways to clean up these method signatures
export interface VCProvider {
  signCredential(
    jwk: Jwk,
    did: string,
    credential: CredentialPayload_v1_1,
    proofOptions: ProofOptions
  ): Promise<JWT>;

  verifyCredential(
    vc: JWT,
    proofOptions: ProofOptions
  ): Promise<VerifiedCredential>;
}

export class DidKitProvider implements VCProvider {
  async signCredential(
    jwk: Jwk,
    did: string,
    credential: CredentialPayload_v1_1,
    proofOptions: ProofOptions
  ): Promise<JWT> {
    const keyStr = JSON.stringify(jwk);
    let verificationMethod
    if (proofOptions.method === DidMethods.KEY) {
     verificationMethod = await DidKit.keyToVerificationMethod(
      proofOptions.method,
      keyStr
    );
     } else if (proofOptions.method === DidMethods.WEB) {
      verificationMethod = proofOptions.verificationMethod
     }

    const issuedCredential = await DidKit.issueCredential(
      JSON.stringify(credential),
      JSON.stringify({
        proofPurpose: proofOptions.assertionMethod,
        proofFormat: proofOptions.format,
        verificationMethod: verificationMethod,
      }),
      keyStr
    );
    return issuedCredential;
  }

  async verifyCredential(
    vc: string,
    proofOptions: ProofOptions
  ): Promise<VerifiedCredential> {
    const result = await DidKit.verifyCredential(
      vc,
      JSON.stringify({
        proofFormat: proofOptions.format,
        // verificationMethod:
        //  "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a#blockchainAccountId",
        //did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a#blockchainAccountId
      })
    );
    const resultObj = JSON.parse(result);
    if (resultObj.errors.length > 0) {
      throw new Error(
        "Encountered errors in verifyCredential: " +
          JSON.stringify(resultObj, null, 2)
      );
    }
    if (resultObj.checks === 0) {
      throw new Error(
        "Got no result verifyCredential: " + JSON.stringify(resultObj, null, 2)
      );
    }
    const cp = decodeJwt(vc);
    // TODO: hack
    return {
      verified: true,
      payload: cp,
      didResolutionResult: {} as DIDResolutionResult,
      signer: {} as VerificationMethod,
      jwt: vc,
      issuer: "",
      verifiableCredential: {} as any,
    };
  }
}

export class DidJwtVcProvider implements VCProvider {
  DidJwtVcProvider() {}

  async signCredential(
    jwk: Jwk,
    did: string, 
    credential: CredentialPayload_v1_1,
    proofOptions: ProofOptions
  ): Promise<JWT> {
    const issuer = buildDidJwtIssuerFromJwk(jwk, did);
    return createVerifiableCredentialJwt(credential, issuer, {});
  }

  verifyCredential(
    vc: JWT,
    proofOptions: ProofOptions,
  ): Promise<VerifiedCredential> {
    return verifyCredential(vc, didResolver, {});
  }
}
