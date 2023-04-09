import {
  jwkToDid,
  DidMethods,
  ProofFormats,
  decodeJwt,
  DidKitProvider,
  VCProvider,
  ASSERTION_METHOD,
  Jwk,
  DidJwtVcProvider,
} from "../../proofs";
import samplePayload from "../fixtures/samplePayload.json";
import { generateEd25519Key } from "@spruceid/didkit-wasm-node";
import { CredentialPayload_v1_1 } from "../../credentials";

let signerJwk: Jwk;
let did: string;
let credential: CredentialPayload_v1_1;
let provider: VCProvider;

beforeEach(() => {
  signerJwk = JSON.parse(generateEd25519Key());
  did = jwkToDid(DidMethods.KEY, signerJwk);
  credential = {
    ...samplePayload,
    issuer: did,
    issuanceDate: new Date().toISOString(),
  };
});

describe("VC provider tests", () => {
  describe("DIDKit provider tests", () => {
    beforeEach(() => {
      provider = new DidKitProvider();
    });

    it("Signs a jwt (did:key)", async () => {
      const issuedCredential = await provider.signCredential(
        DidMethods.KEY,
        signerJwk,
        ProofFormats.JWT,
        credential,
        ASSERTION_METHOD
      );
      expect(issuedCredential).toBeDefined();
      console.log(issuedCredential);

      const decoded = decodeJwt(issuedCredential);
      console.log(JSON.stringify(decoded, null, 2));
    });

    it("Verifies a jwt (did:key)", async () => {
      const issuedCredential = await provider.signCredential(
        DidMethods.KEY,
        signerJwk,
        ProofFormats.JWT,
        credential,
        ASSERTION_METHOD
      );

      const result = await provider.verifyCredential(
        issuedCredential,
        ProofFormats.JWT,
        ASSERTION_METHOD
      );
      const resultObj = JSON.parse(result);
      expect(resultObj.checks.length).toEqual(1);
      expect(resultObj.warnings.length).toEqual(0);
      expect(resultObj.errors.length).toEqual(0);
      expect(resultObj.checks[0]).toEqual("JWS");
      console.log(result);
    });
  });

  describe("DidJwtVc provider tests", () => {
    beforeEach(() => {
      provider = new DidJwtVcProvider();
    });

    it("Signs a jwt (did:key)", async () => {
      const issuedCredential = await provider.signCredential(
        DidMethods.KEY,
        signerJwk,
        ProofFormats.JWT,
        credential,
        ASSERTION_METHOD
      );
      expect(issuedCredential).toBeDefined();
      console.log(issuedCredential);

      const decoded = decodeJwt(issuedCredential);
      console.log(JSON.stringify(decoded, null, 2));
    });

    it("Verifies a jwt (did:key)", async () => {
      const issuedCredential = await provider.signCredential(
        DidMethods.KEY,
        signerJwk,
        ProofFormats.JWT,
        credential,
        ASSERTION_METHOD
      );

      const result = await provider.verifyCredential(
        issuedCredential,
        ProofFormats.JWT,
        ASSERTION_METHOD
      );
      const resultObj = JSON.parse(result);
      expect(resultObj.checks.length).toEqual(1);
      expect(resultObj.warnings.length).toEqual(0);
      expect(resultObj.errors.length).toEqual(0);
      expect(resultObj.checks[0]).toEqual("JWS");
      console.log(result);
    });
  });

  describe("did:pkh", () => {
    it.skip("TODO FIX: Verifes a jwt (did:pkh)", async () => {
      // TODO: I didn't get this to work yet, we need to handle
      // the recovery bit or use ETH-specific validation.
      /*const did = await resolveDID(
        "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a",
        "{}"
      );
      console.log(did);
      const credential = {
        ...samplePayload,
        issuer: "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a",
        issuanceDate: new Date().toISOString(),
      };
      const issuer = new EcdsaSecp256k1RecoveryIssuer(subjectJwk);

      const token = await signJWT(credential, issuer, {});
      console.log(token);

      const recoveredAddress = doRecoverAddress(token);
      console.log(recoveredAddress);*/
    });

    it.skip("Signs a jwt (did:pkh)", async () => {
      /*const credential = {
        ...samplePayload,
        issuer: "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a",
        issuanceDate: new Date().toISOString(),
      };

      const issuedCredential = await signCredential(
        DidMethods.PKH_ETH,
        subjectJwk,
        ProofFormats.JWT,
        credential
      );
      console.log(issuedCredential);

      //const decoded = decodeJwt(issuedCredential);
      // console.log(JSON.stringify(decoded, null, 2));*/
    });
  });
});
