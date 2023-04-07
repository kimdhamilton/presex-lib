import {
  Field,
  FieldBuilder,
  InputDescriptorConstraintsBuilder,
} from "../../..";

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
