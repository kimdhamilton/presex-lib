import { DisplayMapping, Styles } from ".";

export interface OutputDescriptor {
  id: string;
  schema: string;
  name?: string;
  description?: string;
  styles?: Styles | string;
  display?: DisplayMapping | string;
}
