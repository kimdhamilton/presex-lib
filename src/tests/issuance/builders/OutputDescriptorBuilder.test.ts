import { OutputDescriptorBuilder } from "../../..";

describe("OutputDescriptorBuilder", () => {
  it("builds a valid OutputDescriptor", () => {
    const builder = new OutputDescriptorBuilder();
    const result = builder
      .id("output-1")
      .schema("schema-1")
      .name("Output 1")
      .description("An example output descriptor")
      .styles("styles-1")
      .display("display-1")
      .build();

    expect(result).toEqual({
      id: "output-1",
      schema: "schema-1",
      name: "Output 1",
      description: "An example output descriptor",
      styles: "styles-1",
      display: "display-1",
    });
  });

  it("throws an error when required fields are missing", () => {
    const builder = new OutputDescriptorBuilder();
    expect(() => builder.build()).toThrowError(
      "Missing required fields in OutputDescriptorBuilder: id, schema"
    );
  });
});