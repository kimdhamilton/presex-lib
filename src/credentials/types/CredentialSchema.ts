// TODO: check this and figure out if we can constrain any
export interface JSONSchemaProperty {
  type: string;
  format?: string;
  pattern?: string;
}

export interface JSONSchemaNameAndProperty {
  name: string;
  property: JSONSchemaProperty;
}

// TODO: name and structure
export interface JSONSchemaInner {
  required: string[];
  additionalProperties: boolean;
  [key: string]: any; // Index signature for extensibility
}

export interface CredentialSubjectSchema {
  type: string;
  properties: JSONSchemaInner;
}

// TODO: clarify names
export interface Schema {
  $id: string;
  $schema: string;
  description: string;
  type: string;
  properties: {
    credentialSubject: CredentialSubjectSchema;
  };
}

export interface CredentialSchema2022 {
  type: string;
  version: string;
  id: string;
  name: string;
  author: string;
  authored: string;
  schema: Schema;
}

export function enumerateProperties(
  properties: JSONSchemaInner
): JSONSchemaNameAndProperty[] {
  const extensions = [];
  for (const key in properties) {
    if (
      properties.hasOwnProperty(key) &&
      !["required", "additionalProperties"].includes(key)
    ) {
      extensions.push({ name: key, property: properties[key] });
    }
  }
  return extensions;
}

export function requiredProperties(properties: JSONSchemaInner): string[] {
  return properties.required;
}
