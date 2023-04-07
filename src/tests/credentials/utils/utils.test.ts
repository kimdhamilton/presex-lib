import { CredentialSubject, buildCredentialPayload } from "../../..";

describe("utils", () => {
  it("builds Credential Payload", () => {
    const expected = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "EmailCredential"],
      issuer: {
        id: "did:exapmle:123",
      },
      credentialSubject: {
        id: "did:ethr:0x0f0c2e2d1f9d1d0c7c9b0f0c2e2d1f9d1d0c7c9b",
        name: "Alice",
        age: 21,
        country: "USA",
        email: "alice@alice.me",
      },
      credentialSchema: {
        id: "https://schema.org/email",
        type: "CredentialSchema2022",
      },
      //issuanceDate: "2023-04-07T19:55:40.421Z",
    };
    const credentialSubject: CredentialSubject = {
      id: "did:ethr:0x0f0c2e2d1f9d1d0c7c9b0f0c2e2d1f9d1d0c7c9b",
      name: "Alice",
      age: 21,
      country: "USA",
      email: "alice@alice.me",
    };

    const result = buildCredentialPayload(
      "did:exapmle:123",
      "EmailCredential",
      "https://schema.org/email",
      credentialSubject
    );
    expect(result).toMatchObject(expected);
  });
});

// TODO: we need schema validation and also builder validation
