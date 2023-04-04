import { schemaConstraint, trustedIssuerConstraint } from "../helpers";

describe("helpers", () => {
  it("trustedIssuerContraint works", () => {
    const expected = {
      path: ["$.issuer.id", "$.issuer", "$.vc.issuer", "$.iss"],
      purpose: "This restricts to credentials issued by a trusted issuer.",
      filter: {
        type: "string",
        const: "did:example:issuer1",
      },
    };

    const result = trustedIssuerConstraint("did:example:issuer1");
    expect(result).toMatchObject(expected);
  });

  it("schemaConstraint works", () => {
    const expected = {
      path: ["$.credentialSchema.id", "$.vc.credentialSchema.id"],
      filter: {
        type: "string",
        const: "https://abc.gov/drivers-license-schema.json",
      },
      purpose: "This ensures the credential conforms to the expected schema",
    };

    const result = schemaConstraint(
      "https://abc.gov/drivers-license-schema.json"
    );

    expect(result).toMatchObject(expected);
  });
});
