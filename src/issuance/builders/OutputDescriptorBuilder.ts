import {
  DisplayMapping,
  OutputDescriptor, Styles,
} from "..";
import { CredentialManifestBuilder } from ".";


export class OutputDescriptorBuilder<P extends CredentialManifestBuilder> {
  private readonly _data: Partial<OutputDescriptor> = {};
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

  schema(schema: string): this {
    this._data.schema = schema;
    return this;
  }

  name(name: string): this {
    this._data.name = name;
    return this;
  }

  description(description: string): this {
    this._data.description = description;
    return this;
  }

  styles(styles: Styles | string): this {
    this._data.styles = styles;
    return this;
  }

  display(display: DisplayMapping | string): this {
    this._data.display = display;
    return this;
  }

  /**
   * Ends the startInputDescriptor scope created by the parent to complete creation of this Input Descriptor
   * and return to parent's scope
   * @returns
   */
  endOutputDescriptor(): CredentialManifestBuilder {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }
    const result = this.build();
    this._parent.addOutputDescriptor(result);
    return this._parent;
  }

  build(): OutputDescriptor {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (!this._data.hasOwnProperty("schema")) missingFields.push("schema");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in OutputDescriptorBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }

    return this._data as OutputDescriptor;
  }
}
