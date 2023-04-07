import { DescriptorMapEntry } from "../types";
import {
  PresentationSubmissionBuilder,
  PresentationSubmissionWrapperBuilder,
} from ".";

export class DescriptorMapEntryBuilder<
  P extends PresentationSubmissionBuilder<PresentationSubmissionWrapperBuilder>
> {
  private readonly _data: Partial<DescriptorMapEntry> = {};
  private readonly _parent?: P;

  constructor(parent?: P) {
    if (parent) {
      this._parent = parent;
    }
  }

  id(id: string): this {
    this._data.id = id;
    return this;
  }

  format(
    format: "jwt" | "jwt_vc" | "jwt_vp" | "ldp_vc" | "ldp_vp" | "ldp"
  ): this {
    this._data.format = format;
    return this;
  }

  path(path: string): this {
    this._data.path = path;
    return this;
  }

  /**
   * Ends the startDescriptorMapEntry scope created by the parent to complete creation of this Descriptor Map Entry
   *
   * This doesn't yet support nested descriptor maths
   * and return to parent's scope
   * @returns
   */
  endDescriptorMapEntry(): PresentationSubmissionBuilder<PresentationSubmissionWrapperBuilder> {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }
    const result = this.build();
    this._parent.addDescriptorMapEntry(result);
    return this._parent;
  }

  build(): DescriptorMapEntry {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (!this._data.hasOwnProperty("format")) missingFields.push("format");
    if (!this._data.hasOwnProperty("path")) missingFields.push("path");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in DescriptorMapEntryBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }

    return this._data as DescriptorMapEntry;
  }
}
