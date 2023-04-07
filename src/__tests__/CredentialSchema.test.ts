import { enumerateProperties, requiredProperties } from "..";

const example = {
  type: "https://w3c-ccg.github.io/vc-json-schemas/",
  version: "1.0",
  id: "did:example:MDP8AsFhHzhwUvGNuYkX7T/06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
  name: "Email",
  author: "did:example:MDP8AsFhHzhwUvGNuYkX7T",
  authored: "2021-01-01T00:00:00+00:00",
  schema: {
    $id: "email-schema-1.0",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    description: "Email",
    type: "object",
    properties: {
      credentialSubject: {
        type: "object",
        properties: {
          emailAddress: {
            type: "string",
            format: "email",
          },
          required: ["emailAddress"],
          additionalProperties: false,
        },
      },
    },
  },
};

describe("JSONSchemaInner", () => {
  it("enumerates properties ", () => {
    const expected = {
      name: "emailAddress",
      property: {
        type: "string",
        format: "email",
      },
    };

    const emailSchema = {
      emailAddress: {
        type: "string",
        format: "email",
      },

      required: ["emailAddress"],
      additionalProperties: false,
    };

    const props = enumerateProperties(emailSchema);
    expect(props.length).toEqual(1);
    expect(props[0]).toEqual(expected);
  });

  it("returns required properties", () => {
    const emailSchema = {
      emailAddress: {
        type: "string",
        format: "email",
      },

      required: ["emailAddress"],
      additionalProperties: false,
    };

    const props = requiredProperties(emailSchema);
    expect(props.length).toEqual(1);
    expect(props[0]).toEqual("emailAddress");
  });
});
