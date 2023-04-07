import {
  buildPresentationDefinitionFromSchema,
  buildPresentationSubmission,
} from "../pd_helpers";

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
    expect(pd).toMatchObject(expected);
  });

  it("Creates Presentation Definition Wrapper from Schema", () => {
    const pd = buildPresentationDefinitionFromSchema(
      "https://someSchema.org",
      "MyCredentialType"
    );
    const ps = buildPresentationSubmission(pd, "did:example:123");
    console.log(JSON.stringify(ps, null, 2));
    // TODO: vcs should be required
  });
});
