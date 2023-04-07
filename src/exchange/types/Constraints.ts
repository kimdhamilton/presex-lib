import { Field } from ".";

// TODO: rename and reorganize this file
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

export interface HolderConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}

export interface SameSubjectConstraint {
  field_id: string[];
  directive: "required" | "preferred";
}
