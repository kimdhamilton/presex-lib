import {
  InputDescriptorBuilder,
  InputDescriptorConstraintsBuilder,
  PresentationDefinitionBuilder,
  InputDescriptor,
} from "../../..";

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
