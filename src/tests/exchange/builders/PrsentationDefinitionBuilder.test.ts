import {
  InputDescriptorBuilder,
  PresentationDefinition,
  PresentationDefinitionBuilder,
} from "../../..";

describe("PresentationDefinitionBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds PresentationDefinition with required fields only", () => {
      const builder = new PresentationDefinitionBuilder("123");
      builder.inputDescriptors({
        id: "test",
        constraints: {},
      });
      builder.name("Test");
      const presentationDefinition = builder.build();
      expect(presentationDefinition).toEqual({
        id: "123",
        input_descriptors: [
          {
            id: "test",
            constraints: {},
          },
        ],
        name: "Test",
      });
    });

    it("builds PresentationDefinition with all fields", () => {
      const builder = new PresentationDefinitionBuilder("123");
      builder.inputDescriptors({
        id: "test",
        constraints: {},
      });
      builder.name("Test");
      builder.purpose("Test purpose");
      builder.format({
        jwt: {
          alg: ["ES256"],
        },
      });
      builder.frame({
        "@context": "https://www.w3.org/2018/credentials/v1",
        type: ["VerifiableCredential"],
        issuer: "https://example.com",
      });
      builder.submissionRequirements({
        name: "test",
        purpose: "test",
        rule: "all",
        count: 2,
        from: "a",
        from_nested: [
          {
            name: "test",
            purpose: "test",
            rule: "pick",
            count: 2,
            from: "b",
          },
        ],
      });
      const presentationDefinition = builder.build();
      expect(presentationDefinition).toEqual({
        id: "123",
        input_descriptors: [
          {
            id: "test",
            constraints: {},
          },
        ],
        name: "Test",
        purpose: "Test purpose",
        format: {
          jwt: {
            alg: ["ES256"],
          },
        },
        frame: {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: ["VerifiableCredential"],
          issuer: "https://example.com",
        },
        submission_requirements: [
          {
            name: "test",
            purpose: "test",
            rule: "all",
            count: 2,
            from: "a",
            from_nested: [
              {
                name: "test",
                purpose: "test",
                rule: "pick",
                count: 2,
                from: "b",
              },
            ],
          },
        ],
      });
    });

    it("builds a PresentationDefinition with inlined input descriptors", () => {
      const presentationDefinition = new PresentationDefinitionBuilder(
        "presentation_definition_123"
      )
        .inputDescriptors({
          id: "eoc_input",
          constraints: {
            limit_disclosure: "required",
            fields: [],
          },
        })
        .format({ jwt_vc: { alg: ["EdDSA"] } })
        .build();
      expect(presentationDefinition).toMatchObject({
        input_descriptors: [
          {
            id: "eoc_input",
          },
        ],
        id: "presentation_definition_123",
        format: {
          jwt_vc: {
            alg: ["EdDSA"],
          },
        },
      });
    });

    it("builds a PresentationDefinition using nested InputDescriptorBuilder", () => {
      const presentationDefinition: PresentationDefinition =
        new PresentationDefinitionBuilder(
          "32f54163-7166-48f1-93d8-ff217bdb0653"
        )
          .name("Example Presentation Definition")
          .purpose("Example purpose for the Presentation Definition")
          .startInputDescriptor()
          .id("bankaccount_input")
          .name("Full Bank Account Routing Information")
          .purpose(
            "We can only remit payment to a currently-valid bank account, submitted as an ABA RTN + Acct # or IBAN."
          )
          .constraints({
            limit_disclosure: "required",
            fields: [],
          })
          .endInputDescriptor()
          .build();

      expect(presentationDefinition).toEqual({
        id: "32f54163-7166-48f1-93d8-ff217bdb0653",
        name: "Example Presentation Definition",
        purpose: "Example purpose for the Presentation Definition",
        input_descriptors: [
          {
            id: "bankaccount_input",
            name: "Full Bank Account Routing Information",
            purpose:
              "We can only remit payment to a currently-valid bank account, submitted as an ABA RTN + Acct # or IBAN.",
            constraints: {
              limit_disclosure: "required",
              fields: [],
            },
          },
        ],
      });
    });
  });

  describe("startInputDescriptor()", () => {
    it("returns an instance of InputDescriptorBuilder", () => {
      const result = new PresentationDefinitionBuilder(
        "test-pd-id"
      ).startInputDescriptor();
      expect(result instanceof InputDescriptorBuilder).toBe(true);
    });
  });

  describe("build() error conditions", () => {
    it("throws error when input_descriptors is missing", () => {
      const builder = new PresentationDefinitionBuilder("123");
      expect(() => builder.build()).toThrow(
        "Missing required fields in PresentationDefinitionBuilder: input_descriptors"
      );
    });
  });
});
