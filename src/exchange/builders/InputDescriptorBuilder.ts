import {
  ClaimFormatDesignations,
  InputDescriptor,
  InputDescriptorConstraints,
} from "../types";
import {
  InputDescriptorConstraintsBuilder,
  PresentationDefinitionBuilder,
} from ".";

export class InputDescriptorBuilder<P extends PresentationDefinitionBuilder> {
  private readonly _data: Partial<InputDescriptor> = {};
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

  name(name: string): this {
    this._data.name = name;
    return this;
  }

  purpose(purpose: string): this {
    this._data.purpose = purpose;
    return this;
  }

  group(group: string[]): this {
    this._data.group = group;
    return this;
  }

  format(format: ClaimFormatDesignations): this {
    this._data.format = format;
    return this;
  }

  /**
   * Populates constraints with a InputDescriptorConstraints object
   * @param constraints
   * @returns
   */
  constraints(constraints: InputDescriptorConstraints): this {
    this._data.constraints = constraints;
    return this;
  }

  /**
   * Enables fluent creatiion of Constraints through nested builders. When complete, call
   * finishConstraints()
   * @returns
   */
  startConstraints(): InputDescriptorConstraintsBuilder<this> {
    return new InputDescriptorConstraintsBuilder(this);
  }

  /**
   * Ends the startInputDescriptor scope created by the parent to complete creation of this Input Descriptor
   * and return to parent's scope
   * @returns
   */
  endInputDescriptor(): PresentationDefinitionBuilder {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }
    const result = this.build();
    this._parent.addInputDescriptor(result);
    return this._parent;
  }

  build(): InputDescriptor {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (!this._data.hasOwnProperty("constraints"))
      missingFields.push("constraints");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in InputDescriptorBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }

    return this._data as InputDescriptor;
  }
}
