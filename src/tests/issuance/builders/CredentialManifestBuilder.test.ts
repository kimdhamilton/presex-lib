
import { CredentialManifestBuilder } from "../../.."

describe("CredentialManifestBuilder", () => {
  it("builds a valid CredentialManifest", () => {
    const builder = new CredentialManifestBuilder();
    const result = builder
      .id("123")
      .specVersion("1.0")
      .issuer({ id: "issuer-1" })
      .outputDescriptors(
        {
          id: "output-1",
          schema: "schema-1",
          name: "Output 1",
        },
        {
          id: "output-2",
          schema: "schema-2",
          name: "Output 2",
        }
      )
      .build();

    expect(result).toEqual({
      id: "123",
      spec_version: "1.0",
      issuer: { id: "issuer-1" },
      output_descriptors: [
        {
          id: "output-1",
          schema: "schema-1",
          name: "Output 1",
        },
        {
          id: "output-2",
          schema: "schema-2",
          name: "Output 2",
        },
      ],
    });
  });

  it("throws an error when required fields are missing", () => {
    const builder = new CredentialManifestBuilder();
    expect(() => builder.build()).toThrowError(
      "Missing required fields in CredentialManifestBuilder: id"
    );
  });
});

