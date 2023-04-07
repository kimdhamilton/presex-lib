import {
  ClaimFormatDesignations,
  InputDescriptor,
  PresentationDefinition,
  SubmissionRequirement,
} from "../types";
import { InputDescriptorBuilder } from ".";

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
