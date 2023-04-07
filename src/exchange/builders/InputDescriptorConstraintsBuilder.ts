import {
  Field,
  HolderConstraint,
  InputDescriptorConstraints,
  SameSubjectConstraint,
  StatusConstraints,
} from "../types";

import {
  FieldBuilder,
  InputDescriptorBuilder,
  PresentationDefinitionBuilder,
} from ".";

export class InputDescriptorConstraintsBuilder<
  P extends InputDescriptorBuilder<PresentationDefinitionBuilder>
> {
  private _data: Partial<InputDescriptorConstraints> = {};
  private readonly _parent?: P;

  constructor(parent?: P) {
    if (parent) {
      this._parent = parent;
    }
  }

  /***
   * Populates fields from the provided Fields
   */
  fields(...fields: Field[]): this {
    this._data.fields = fields;
    return this;
  }

  /**
   * Adds a single Field to the field array, after ensuring the field
   * array is defined
   * @param field
   * @returns
   */
  addField(field: Field): this {
    if (!this._data.fields) {
      this._data.fields = [];
    }
    this._data.fields.push(field);
    return this;
  }

  /**
   * Enables fluent creatiion of Fields through nested builders. When complete, call
   * finishField()
   * @returns
   */
  startField(): FieldBuilder<this> {
    return new FieldBuilder(this);
  }

  limitDisclosure(limitDisclosure: "required" | "preferred"): this {
    this._data.limit_disclosure = limitDisclosure;
    return this;
  }

  statuses(statuses: StatusConstraints): this {
    this._data.statuses = statuses;
    return this;
  }

  subjectIsIssuer(subjectIsIssuer: "required" | "preferred"): this {
    this._data.subject_is_issuer = subjectIsIssuer;
    return this;
  }

  isHolder(...is_holder: HolderConstraint[]): this {
    this._data.is_holder = is_holder;
    return this;
  }

  sameSubject(...sameSubject: SameSubjectConstraint[]): this {
    this._data.same_subject = sameSubject;
    return this;
  }

  /**
   * Ends the startConstraints scope created by the parent to complete creation of this Constraints
   * and return to parent's scope
   * @returns
   */
  endConstraints(): InputDescriptorBuilder<PresentationDefinitionBuilder> {
    if (!this._parent) {
      throw new Error(
        "Parent was not provided; use build() if you are creating this as a standalone object, or use the startX method on the parent to use nested building styles"
      );
    }

    const result = this.build();
    this._parent.constraints(result);
    return this._parent;
  }

  build(): InputDescriptorConstraints {
    return this._data as InputDescriptorConstraints;
  }
}
