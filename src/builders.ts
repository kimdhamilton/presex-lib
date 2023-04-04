import {
  ClaimFormatDesignations,
  InputDescriptorConstraints,
  InputDescriptor,
  PresentationDefinition,
  SubmissionRequirement,
  Field,
  SameSubjectConstraint,
  StatusConstraints,
  HolderConstraint,
  JSONSchema,
  DescriptorMapEntry,
  PresentationSubmission,
} from "./types";

export class PresentationDefinitionBuilder {
  private readonly _data: Partial<PresentationDefinition> = {};

  constructor(id: string) {
    this._data.id = id;
  }

  name(name: string): this {
    this._data.name = name;
    return this;
  }

  purpose(purpose: string): this {
    this._data.purpose = purpose;
    return this;
  }

  format(format: ClaimFormatDesignations): this {
    this._data.format = format;
    return this;
  }

  frame(frame: Record<string, unknown>): this {
    this._data.frame = frame;
    return this;
  }

  submissionRequirements(
    ...submissionRequirements: SubmissionRequirement[]
  ): this {
    this._data.submission_requirements = submissionRequirements;
    return this;
  }

  /**
   * Populates input_descriptors from the provided Input Descriptors
   * @param inputDescriptors
   * @returns
   */
  inputDescriptors(...inputDescriptors: InputDescriptor[]): this {
    this._data.input_descriptors = inputDescriptors;
    return this;
  }

  /**
   * Adds a single Input Descriptor to the input_descriptors array, after ensuring the input_descriptors
   * array is defined
   * @param inputDescriptor
   * @returns
   */
  addInputDescriptor(inputDescriptor: InputDescriptor): this {
    if (!this._data.input_descriptors) {
      this._data.input_descriptors = [];
    }
    this._data.input_descriptors.push(inputDescriptor);
    return this;
  }

  /**
   * Enables fluent creatiion of Input Descriptors through nested builders. When complete, call
   * finishInputDescriptor()
   * @returns
   */
  startInputDescriptor(): InputDescriptorBuilder<this> {
    return new InputDescriptorBuilder(this);
  }

  build(): PresentationDefinition {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (!this._data.hasOwnProperty("input_descriptors"))
      missingFields.push("input_descriptors");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in PresentationDefinitionBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }

    return this._data as PresentationDefinition;
  }
}

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

export class PresentationSubmissionBuilder {
  private readonly _data: Partial<PresentationSubmission> = {};

  constructor() {}

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

export class DescriptorMapEntryBuilder<
  P extends PresentationSubmissionBuilder
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
  endDescriptorMapEntry(): PresentationSubmissionBuilder {
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
