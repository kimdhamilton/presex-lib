import {
  Field,
  FieldBuilder,
  InputDescriptorBuilder,
  InputDescriptorConstraintsBuilder,
  HolderConstraint,
  InputDescriptorConstraints,
  SameSubjectConstraint,
  StatusDirective,
} from "../../..";

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
