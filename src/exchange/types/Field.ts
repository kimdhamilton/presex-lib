import { JSONSchema } from "./types";

export interface Field {
  id?: string;
  optional?: boolean;
  path: string[];
  purpose?: string;
  name?: string;
  intent_to_retain?: boolean;
  filter: JSONSchema;
  predicate?: "required" | "preferred";
}
