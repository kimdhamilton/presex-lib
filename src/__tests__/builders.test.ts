import {
  Field,
  FieldBuilder,
  InputDescriptorBuilder,
  InputDescriptorConstraintsBuilder,
  PresentationDefinition,
  PresentationDefinitionBuilder,
  HolderConstraint,
  InputDescriptorConstraints,
  SameSubjectConstraint,
  InputDescriptor,
  StatusDirective,
  PresentationSubmissionBuilder,
  DescriptorMapEntryBuilder,
} from "..";

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
describe("InputDescriptorBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds minimal object with required fields", () => {
      const expected: InputDescriptor = {
        id: "test-id",
        constraints: {},
      };

      const result = new InputDescriptorBuilder(
        new PresentationDefinitionBuilder("test-pd-id")
      )
        .id("test-id")
        .constraints({})
        .build();
      expect(result).toEqual(expected);
    });

    it("populates parent's input descriptors if called from parent's nested builder", () => {
      const expected = {
        _data: {
          id: "id",
          input_descriptors: [
            {
              id: "abcd",
              constraints: {},
            },
          ],
        },
      };

      const parent = new PresentationDefinitionBuilder("id");
      const result = parent
        .startInputDescriptor()
        .id("abcd")
        .constraints({})
        .endInputDescriptor();

      expect(result).toEqual(expected);
    });
  });

  describe("startConstraints()", () => {
    it("returns an instance of InputDescriptorConstraintsBuilder", () => {
      const result = new InputDescriptorBuilder(
        new PresentationDefinitionBuilder("test-pd-id")
      ).startConstraints();
      expect(result instanceof InputDescriptorConstraintsBuilder).toBe(true);
    });
  });

  describe("endInputDescriptor()", () => {
    it("returns an instance of PresentationDefinitionBuilder", () => {
      const result = new InputDescriptorBuilder(
        new PresentationDefinitionBuilder("test-pd-id")
      )
        .id("test-id")
        .startConstraints()
        .endConstraints()
        .endInputDescriptor();
      expect(result instanceof PresentationDefinitionBuilder).toBe(true);
    });
  });

  describe("build() error conditions", () => {
    it("throws error when id is missing", () => {
      expect(() =>
        new InputDescriptorBuilder(
          new PresentationDefinitionBuilder("test-pd-id")
        )
          .startConstraints()
          .endConstraints()
          .build()
      ).toThrow("Missing required fields in InputDescriptorBuilder: id");
    });

    it("throws error when constraints is missing", () => {
      expect(() =>
        new InputDescriptorBuilder(
          new PresentationDefinitionBuilder("test-pd-id")
        )
          .id("test-id")
          .build()
      ).toThrow(
        "Missing required fields in InputDescriptorBuilder: constraints"
      );
    });
  });
});

describe("InputDescriptorConstraintsBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds an InputDesciptorConstraints using nested FieldBuilder", () => {
      const field: Field = { path: ["$.a"], filter: {}, predicate: "required" };
      const expected: InputDescriptorConstraints = { fields: [field] };

      const result = new InputDescriptorConstraintsBuilder()
        .startField()
        .path("$.a")
        .predicate("required")
        .filter({})
        .endField()
        .build();

      expect(result).toEqual(expected);
    });

    it("populates parent's constraints if called from parent's nested builder", () => {
      const field: Field = { path: ["$.a"], filter: {}, predicate: "required" };

      const expected = {
        _data: {
          constraints: {
            fields: [
              {
                path: ["$.a"],
                filter: {},
                predicate: "required",
              },
            ],
          },
        },
      };

      const fieldsArray = [field];
      const parent = new InputDescriptorBuilder();
      const result = parent
        .startConstraints()
        .fields(...fieldsArray)
        .endConstraints();

      expect(result).toEqual(expected);
    });
  });

  describe("individual property setting tests", () => {
    it("sets fields", () => {
      const field: Field = { path: ["$.a"], filter: {}, predicate: "required" };

      const expected: InputDescriptorConstraints = { fields: [field] };

      const result = new InputDescriptorConstraintsBuilder()
        .fields(field)
        .build();

      expect(result).toEqual(expected);
    });

    it("adds field", () => {
      const field: Field = { path: ["$.a"], filter: {}, predicate: "required" };

      const expected: InputDescriptorConstraints = { fields: [field] };

      const result = new InputDescriptorConstraintsBuilder()
        .addField(field)
        .build();

      expect(result).toEqual(expected);
    });

    it("sets limitDisclosure", () => {
      const limitDisclosure: "required" | "preferred" = "preferred";

      const expected: InputDescriptorConstraints = {
        limit_disclosure: limitDisclosure,
      };

      const result = new InputDescriptorConstraintsBuilder()
        .limitDisclosure(limitDisclosure)
        .build();

      expect(result).toEqual(expected);
    });

    it("sets statuses", () => {
      const activeStatusDirective: StatusDirective = {
        directive: "required",
        type: ["some-type"],
      };

      const expected: InputDescriptorConstraints = {
        statuses: { active: activeStatusDirective },
      };

      const result = new InputDescriptorConstraintsBuilder()
        .statuses({ active: activeStatusDirective })
        .build();

      expect(result).toEqual(expected);
    });

    it("sets subjectIsIssuer", () => {
      const subjectIsIssuer: "required" | "preferred" = "required";

      const expected: InputDescriptorConstraints = {
        subject_is_issuer: subjectIsIssuer,
      };

      const result = new InputDescriptorConstraintsBuilder()
        .subjectIsIssuer(subjectIsIssuer)
        .build();

      expect(result).toEqual(expected);
    });

    it("sets isHolder", () => {
      const holderConstraint: HolderConstraint = {
        field_id: ["$.a"],
        directive: "preferred",
      };

      const expected: InputDescriptorConstraints = {
        is_holder: [holderConstraint],
      };

      const result = new InputDescriptorConstraintsBuilder()
        .isHolder(holderConstraint)
        .build();

      expect(result).toEqual(expected);
    });

    it("sets sameSubject", () => {
      const subjectConstraint: SameSubjectConstraint = {
        field_id: ["$.a"],
        directive: "preferred",
      };

      const expected: InputDescriptorConstraints = {
        same_subject: [subjectConstraint],
      };

      const result = new InputDescriptorConstraintsBuilder()
        .sameSubject(subjectConstraint)
        .build();

      expect(result).toEqual(expected);
    });
  });

  describe("startField()", () => {
    it("returns an instance of FieldBuilder", () => {
      const result = new InputDescriptorConstraintsBuilder(
        new InputDescriptorBuilder()
      ).startField();
      expect(result instanceof FieldBuilder).toBe(true);
    });
  });

  describe("endConstraints()", () => {
    it("returns an instance of InputDescriptorBuilder", () => {
      const result = new InputDescriptorConstraintsBuilder(
        new InputDescriptorBuilder()
      ).endConstraints();
      expect(result instanceof InputDescriptorBuilder).toBe(true);
    });
  });
});

describe("FieldBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds Field with required fields", () => {
      const expected: Field = {
        path: ["$.attr1", "$.attr2"],
        filter: { type: "string" },
      };

      const actual = new FieldBuilder()
        .path("$.attr1", "$.attr2")
        .filter({ type: "string" })
        .build();

      expect(actual).toEqual(expected);
    });

    it("builds Field with all fields, including optional ones", () => {
      const expected: Field = {
        optional: true,
        path: ["$.path.to.field"],
        purpose: "test-purpose",
        name: "test-name",
        intent_to_retain: true,
        filter: { type: "string" },
        predicate: "required",
      };
      const builder = new FieldBuilder()
        .path("$.path.to.field")
        .optional(true)
        .purpose("test-purpose")
        .name("test-name")
        .intentToRetain(true)
        .filter({ type: "string" })
        .predicate("required");

      const actual = builder.build();
      expect(actual).toEqual(expected);
    });

    it("populates parent's fields if called from parent's nested builder", () => {
      const expected = {
        _data: {
          fields: [
            {
              path: ["$.a"],
              filter: {},
              predicate: "required",
            },
          ],
        },
      };

      const parent = new InputDescriptorConstraintsBuilder();
      const result = parent
        .startField()
        .path("$.a")
        .filter({})
        .predicate("required")
        .endField();

      expect(result).toEqual(expected);
    });
  });
  describe("endField()", () => {
    it("returns an instance of InputDescriptorConstraintsBuilder", () => {
      const result = new FieldBuilder(new InputDescriptorConstraintsBuilder())
        .path("abc")
        .endField();
      expect(result instanceof InputDescriptorConstraintsBuilder).toBe(true);
    });
  });

  describe("build() error conditions", () => {
    it("throws error if required fields are missing", () => {
      expect(() => new FieldBuilder().build()).toThrowError(
        "Missing required fields in FieldBuilder: path"
      );
    });
  });
});

describe("PresentationSubmissionBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds a simple Presentation Submission", async () => {
      const presentationSubmission = new PresentationSubmissionBuilder()
        .id("presentation_submission_123")
        .definitionId("presentation_definition_123")
        .descriptorMap(
          {
            id: "eoc_output",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
          {
            id: "eoc_output2",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          }
        )
        .build();

      expect(presentationSubmission).toEqual({
        id: "presentation_submission_123",
        definition_id: "presentation_definition_123",
        descriptor_map: [
          {
            id: "eoc_output",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
          {
            id: "eoc_output2",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
        ],
      });
    });

    it("builds a PresentationSubmission object with a nested DescriptorMapEntryBuilder", () => {
      const submission = new PresentationSubmissionBuilder()
        .id("123")
        .definitionId("def-456")
        .startDescriptorMapEntry()
        .id("dm1")
        .format("jwt_vc")
        .path("$.claim")
        .endDescriptorMapEntry()
        .build();

      expect(submission.id).toEqual("123");
      expect(submission.definition_id).toEqual("def-456");
      expect(submission.descriptor_map.length).toEqual(1);

      const dm1 = submission.descriptor_map[0];
      expect(dm1.id).toEqual("dm1");
      expect(dm1.format).toEqual("jwt_vc");
      expect(dm1.path).toEqual("$.claim");
    });
  });

  describe("build() error conditions", () => {
    it("throws error when id is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .definitionId("abc")
          .descriptorMap({
            id: "id1",
            format: "jwt_vc",
            path: "$.claim",
          })
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: id"
      );
    });
    it("throws error when definition_id is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .id("123")
          .descriptorMap({
            id: "id1",
            format: "jwt_vc",
            path: "$.claim",
          })
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: definition_id"
      );
    });

    it("throws error when descriptor_map is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .id("123")
          .definitionId("abc")
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: descriptor_map"
      );
    });
  });
});

describe("DescriptorMapEntryBuilder", () => {
  it("builds a DescriptorMapEntry object", () => {
    const descriptorMapEntry = new DescriptorMapEntryBuilder()
      .id("dm1")
      .format("jwt_vp")
      .path("$.claim")
      .build();

    expect(descriptorMapEntry.id).toEqual("dm1");
    expect(descriptorMapEntry.format).toEqual("jwt_vp");
    expect(descriptorMapEntry.path).toEqual("$.claim");
    expect(descriptorMapEntry.path_nested).toBeUndefined();
  });

  describe("build() error conditions", () => {
    it("throws error when id is missing", () => {
      expect(() =>
        new DescriptorMapEntryBuilder().format("jwt_vp").path("$.claim").build()
      ).toThrowError(
        "Missing required fields in DescriptorMapEntryBuilder: id"
      );
    });

    it("throws error when format is missing", () => {
      expect(() =>
        new DescriptorMapEntryBuilder().id("abc").path("$.claim").build()
      ).toThrowError(
        "Missing required fields in DescriptorMapEntryBuilder: format"
      );
    });

    it("throws error with path is missing", () => {
      expect(() =>
        new DescriptorMapEntryBuilder().id("abc").format("jwt_vp").build()
      ).toThrowError(
        "Missing required fields in DescriptorMapEntryBuilder: path"
      );
    });
  });
});
