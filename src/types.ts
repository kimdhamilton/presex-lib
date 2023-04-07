import { Verifiable, W3CPresentation } from "did-jwt-vc";

export interface PresentationDefinition {
  id: string;
  name?: string;
  purpose?: string;
  format?: ClaimFormatDesignations;
  frame?: Record<string, unknown>;
  submission_requirements?: SubmissionRequirement[];
  input_descriptors: InputDescriptor[];
}

export interface ClaimFormatDesignationAlg {
  alg: string[];
}

export interface ClaimFormatDesignationProof {
  proof_type: string[];
}

// Note: not extensible
export interface ClaimFormatDesignations {
  jwt?: ClaimFormatDesignationAlg;
  jwt_vc?: ClaimFormatDesignationAlg;
  jwt_vp?: ClaimFormatDesignationAlg;
  ldp_vc?: ClaimFormatDesignationProof;
  ldp_vp?: ClaimFormatDesignationProof;
  ldp?: ClaimFormatDesignationProof;
}

export interface SubmissionRequirement {
  name?: string;
  purpose?: string;
  rule: "all" | "pick";
  count?: number;
  min?: number;
  max?: number;
  from?: string;
  from_nested?: SubmissionRequirement[];
}

export interface InputDescriptor {
  id: string;
  name?: string;
  purpose?: string;
  group?: string[];
  constraints: InputDescriptorConstraints;
  format?: ClaimFormatDesignations;
}

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

export interface HolderConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}

export interface SameSubjectConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}

export type JSONSchema = Record<string, unknown>;

export interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: DescriptorMapEntry[];
}

export interface DescriptorMapEntry {
  id: string;
  format: "jwt" | "jwt_vc" | "jwt_vp" | "ldp_vc" | "ldp_vp" | "ldp";
  path: string;
  path_nested?: DescriptorMapEntry;
}

export interface InputDescriptorConstraints {
  limit_disclosure?: "required" | "preferred";
  statuses?: StatusConstraints;
  fields?: Field[];
  subject_is_issuer?: "required" | "preferred";
  is_holder?: HolderConstraint[];
  same_subject?: SameSubjectConstraint[];
}

export interface StatusConstraints {
  active?: StatusDirective;
  suspended?: StatusDirective;
  revoked?: StatusDirective;
}

export interface StatusDirective {
  directive: "required" | "allowed" | "disallowed";
  type?: string[];
}

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

// TODO: consolidate the next two?
export interface HolderConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}

export interface SameSubjectConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}

export enum ConstraintDirective {
  REQUIRED = "required",
  PREFERRED = "preferred",
}

export enum StatusConstraintDirective {
  REQUIRED = "required",
  ALLOWED = "allowed",
  DISALLOWED = "disallowed",
}

///// Used by CM too?
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

export type PresentationSubmissionWrapper = W3CPresentation & {
  presentation_submission: PresentationSubmission;
};
