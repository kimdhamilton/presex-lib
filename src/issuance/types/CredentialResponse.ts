import { DescriptorMapEntry } from "../../exchange";

export interface CredentialResponse {
  id: string;
  spec_version: string;
  manifest_id: string;
  application_id?: string;
  fulfillment?: Fulfillment;
  denial?: Denial;
}

export interface Fulfillment {
  descriptor_map: DescriptorMapEntry[];
}

export interface Denial {
  reason: string;
  input_descriptors?: string[];
}
