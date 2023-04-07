import { DescriptorMapEntry, PresentationSubmission } from "../types";
import {
  PresentationSubmissionWrapperBuilder,
  DescriptorMapEntryBuilder,
} from ".";

export class PresentationSubmissionBuilder<
  P extends PresentationSubmissionWrapperBuilder
> {
  private readonly _data: Partial<PresentationSubmission> = {};
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

  definitionId(definition_id: string): this {
    this._data.definition_id = definition_id;
    return this;
  }

  descriptorMap(...descriptorMap: DescriptorMapEntry[]): this {
    this._data.descriptor_map = descriptorMap;
    return this;
  }

  /**
   * Adds a single Descriptor Map Entry to the descriptor_map array, after ensuring the descriptor_map
   * array is defined
   * @param descriptorMapEntry
   * @returns
   */
  addDescriptorMapEntry(descriptorMapEntry: DescriptorMapEntry): this {
    if (!this._data.descriptor_map) {
      this._data.descriptor_map = [];
    }
    this._data.descriptor_map.push(descriptorMapEntry);
    return this;
  }

  /**
   * Enables fluent creatiion of Descriptor Map Entries through nested builders. When complete, call
   * endDescriptorMapEntry()
   * @returns
   */
  startDescriptorMapEntry(): DescriptorMapEntryBuilder<this> {
    return new DescriptorMapEntryBuilder(this);
  }

  /**
   * Ends the startPresentationSubmission scope created by the parent to complete creation of this PresentationSubmission
   * and return to parent's scope
   * @returns
   */
  endPresentationSubmission(): PresentationSubmissionWrapperBuilder {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }
    const result = this.build();
    this._parent.presentation_submission(result);
    return this._parent;
  }

  build(): PresentationSubmission {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (!this._data.hasOwnProperty("definition_id"))
      missingFields.push("definition_id");
    if (!this._data.hasOwnProperty("descriptor_map"))
      missingFields.push("descriptor_map");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in PresentationSubmissionBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }

    return this._data as PresentationSubmission;
  }
}
