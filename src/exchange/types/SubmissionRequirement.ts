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
