import { OutputDescriptorBuilder } from '.';
import { CredentialManifest, Issuer, OutputDescriptor } from '..';

export class CredentialManifestBuilder {
  private readonly _data: Partial<CredentialManifest> = {};

  constructor() {
  }

  public id(id: string): CredentialManifestBuilder {
    this._data.id = id;
    return this;
  }

  public specVersion(specVersion: string): CredentialManifestBuilder {
    this._data.spec_version = specVersion;
    return this;
  }

  public issuer(issuer: Issuer): CredentialManifestBuilder {
    this._data.issuer = issuer;
    return this;
  }

  /**
   * Populates output_descriptors from the provided Output Descriptors
   * @param outputDescriptors
   * @returns
   */
  outputDescriptors(...outputDescriptors: OutputDescriptor[]): this {
    this._data.output_descriptors = outputDescriptors;
    return this;
  }

  /**
   * Adds a single Output Descriptor to the output_descriptors array, after ensuring the output_descriptors
   * array is defined
   * @param inputDescriptor
   * @returns
   */
  addOutputDescriptor(inputDescriptor: OutputDescriptor): this {
    if (!this._data.output_descriptors) {
      this._data.output_descriptors = [];
    }
    this._data.output_descriptors.push(inputDescriptor);
    return this;
  }

  /**
   * Enables fluent creatiion of Output Descriptors through nested builders. When complete, call
   * finishOutputDescriptor()
   * @returns
   */
  startOutputDescriptor(): OutputDescriptorBuilder<this> {
    return new OutputDescriptorBuilder(this);
  }

  public build(): CredentialManifest {
    const missingFields: string[] = [];
    if (!this._data.hasOwnProperty("id")) missingFields.push("id");
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in CredentialManifestBuilder: ${missingFields.join(
          ", "
        )}`
      );
    }
    return this._data as CredentialManifest;
  }
}

