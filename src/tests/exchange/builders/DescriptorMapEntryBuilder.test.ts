import { DescriptorMapEntryBuilder } from "../../..";

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
