// TODO: where do these go?

export type JSONSchema = Record<string, unknown>;

export interface DataMappingSchemaNonString {
  type: "boolean" | "number" | "integer";
}

export interface DataMappingSchemaString {
  type: "string";
  format?:
    | "date-time"
    | "time"
    | "date"
    | "email"
    | "idn-email"
    | "hostname"
    | "idn-hostname"
    | "ipv4"
    | "ipv6"
    | "uri"
    | "uri-reference"
    | "iri"
    | "iri-reference";
}

export type DataMappingSchema =
  | DataMappingSchemaString
  | DataMappingSchemaNonString;
