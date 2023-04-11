import {
  jwkToDid,
  DidMethods,
  ProofFormats,
  decodeJwt,
  DidKitProvider,
  ASSERTION_METHOD,
  Jwk,
  DidJwtVcProvider,
  VCProvider,
} from "../../proofs";
import samplePayload from "../fixtures/samplePayload.json";
import issuerJwk from "../fixtures/issuerJwk.json";
import { generateEd25519Key } from "@spruceid/didkit-wasm-node";
import { CredentialPayload_v1_1 } from "../../credentials";

let signerJwk: Jwk;
let did: string;
let verificationMethod: any;
let credential: CredentialPayload_v1_1;


function prep(didMethod: DidMethods) {
  if (didMethod === DidMethods.KEY) {
    signerJwk = JSON.parse(generateEd25519Key());
    did = jwkToDid(DidMethods.KEY, signerJwk);
  } else if (didMethod === DidMethods.WEB) {
    const { privateKeyJwk, ...verificationMethod } = issuerJwk.verificationMethod[0]
    signerJwk = privateKeyJwk;
    did = issuerJwk.id;
  } else {
    throw new Error("Unsupported DID method");
  }

  credential = {
    ...samplePayload,
    issuer: did,
    issuanceDate: new Date().toISOString(),
  };
    
}
// TODO: looks like I clobbered issuerJwk with Did doc.

describe.each([
  [new DidKitProvider(), DidMethods.KEY],
  [new DidJwtVcProvider(), DidMethods.KEY],
  [new DidJwtVcProvider(), DidMethods.WEB]
])('VCProvider:(%s, did:%s)', (provider: VCProvider, didMethod: DidMethods) => {
  it("Signs a jwt (did:key)", async () => {
    prep(didMethod);
    const issuedCredential = await provider.signCredential(
      signerJwk,
      did,
      credential,
      {
        method: didMethod,
        format: ProofFormats.JWT,
        assertionMethod: ASSERTION_METHOD,
        verificationMethod: verificationMethod
      }
    );
    expect(issuedCredential).toBeDefined();

    const decoded = decodeJwt(issuedCredential);
    expect(decoded).toBeDefined();
    expect(decoded.iss).toEqual(did);
    expect(decoded.jti).toEqual("http://example.org/credentials/3731");
    expect(decoded.sub).toEqual(
      "did:ethr:0x0f0c2e2d1f9d1d0c7c9b0f0c2e2d1f9d1d0c7c9b"
    );
  });

  it("Verifies a jwt (did:key)", async () => {
    prep(didMethod);
    const issuedCredential = await provider.signCredential(
      signerJwk,
      did,
      credential,
      {
        method: didMethod,
        format: ProofFormats.JWT,
        assertionMethod: ASSERTION_METHOD
      }
    );

    const result = await provider.verifyCredential(
      issuedCredential,
      {
        format: ProofFormats.JWT,
        assertionMethod: ASSERTION_METHOD
      }
    );
    console.log(JSON.stringify(result, null, 2));
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
    const credential = {
      ...samplePayload,
      issuer: "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a",
      issuanceDate: new Date().toISOString(),
    };
    const issuer = new EcdsaSecp256k1RecoveryIssuer(subjectJwk);

    const token = await signJWT(credential, issuer, {});

    const recoveredAddress = doRecoverAddress(token);
    */
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
    */
  });
});


