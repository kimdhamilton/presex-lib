import { Field, JSONSchema } from "../types";
import {
  PresentationDefinitionBuilder,
  InputDescriptorBuilder,
  InputDescriptorConstraintsBuilder,
} from ".";

export class FieldBuilder<
  P extends InputDescriptorConstraintsBuilder<
    InputDescriptorBuilder<PresentationDefinitionBuilder>
  >
> {
  private _data: Partial<Field> = {};
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

  /***
   * Populates path from the provided JSONPaths
   */
  path(...path: string[]): this {
    this._data.path = path;
    return this;
  }

  /**
   * Adds a single JSONPath to the path array, after ensuring the path
   * array is defined
   * @param field
   * @returns
   */
  addPath(path: string): this {
    if (!this._data.path) {
      this._data.path = [];
    }
    this._data.path.push(path);
    return this;
  }

  optional(optional: boolean): this {
    this._data.optional = optional;
    return this;
  }

  purpose(purpose: string): this {
    this._data.purpose = purpose;
    return this;
  }

  name(name: string): this {
    this._data.name = name;
    return this;
  }

  intentToRetain(intentToRetain: boolean): this {
    this._data.intent_to_retain = intentToRetain;
    return this;
  }

  filter(filter: JSONSchema): this {
    this._data.filter = filter;
    return this;
  }

  predicate(predicate: "required" | "preferred"): this {
    this._data.predicate = predicate;
    return this;
  }

  /**
   * Ends the startField scope created by the parent to complete creation of this Field
   * and return to parent's scope
   * @returns
   */
  endField(): InputDescriptorConstraintsBuilder<
    InputDescriptorBuilder<PresentationDefinitionBuilder>
  > {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }
    const result = this.build();
    this._parent.addField(result);
    return this._parent;
  }

  build(): Field {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("path")) missingFields.push("path");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in FieldBuilder: ${missingFields.join(", ")}`
      );
    }
    return this._data as Field;
  }
}
