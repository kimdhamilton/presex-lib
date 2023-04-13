import { generateEd25519Key } from "@spruceid/didkit-wasm-node";
import {
  buildPresentationDefinitionFromSchema,
  buildPresentationSubmission,
} from "../../../exchange";
import {
  ASSERTION_METHOD,
  DidJwtVcProvider,
  DidMethods,
  ProofFormats,
  jwkToDid,
} from "../../../proofs";
import samplePayload from "../../fixtures/samplePayload.json";

describe("Presentation Definition Helpers", () => {
  it("Creates Presentation Definition from Schema", () => {
    const expected = {
      // "id": "0bbce2a5-6127-4e7d-810b-e87718af33c1",
      input_descriptors: [
        {
          id: "MyCredentialType",
          name: "Proof of MyCredentialType",
          purpose:
            "Please provide a valid credential from a MyCredentialType issuer",
          constraints: {
            fields: [
              {
                path: ["$.credentialSchema.id", "$.vc.credentialSchema.id"],
                filter: {
                  type: "string",
                  const: "https://someSchema.org",
                },
                purpose:
                  "This ensures the credential conforms to the expected schema",
              },
            ],
            statuses: {
              active: {
                directive: "required",
              },
            },
          },
        },
      ],
    };
    const pd = buildPresentationDefinitionFromSchema(
      "https://someSchema.org",
      "MyCredentialType"
    );
    console.log(JSON.stringify(pd, null, 2));
    expect(pd).toMatchObject(expected);
  });

  it("Creates Presentation Submission from PD", async () => {
    const signerJwk = JSON.parse(generateEd25519Key());
    const did = jwkToDid(DidMethods.KEY, signerJwk);
    const credential = {
      ...samplePayload,
      issuer: did,
      issuanceDate: new Date().toISOString(),
    };

    const provider = new DidJwtVcProvider();
    const jwt = await provider.signCredential(
      signerJwk,
      did,
      credential,
      {
        format: ProofFormats.JWT,
        method: DidMethods.KEY,
        assertionMethod: ASSERTION_METHOD,
      }
    );

    const pd = buildPresentationDefinitionFromSchema(
      "https://someSchema.org",
      "MyCredentialType"
    );
    const ps = buildPresentationSubmission(pd, did, jwt);
    console.log(JSON.stringify(ps, null, 2));
  });
});
