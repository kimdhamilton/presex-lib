import { isEmpty } from "lodash";
import { FieldBuilder } from "./builders";

import {
  ClaimFormatDesignations,
  ConstraintDirective,
  DataMappingSchema,
  Field,
  StatusConstraints,
} from "./types";

// Note: this file contains a lot of VC-isms, but mixed with PE-isms
export const CREDENTIAL_SCHEMA_PROPERTY_NAME = "credentialSchema";
export const CREDENTIAL_SUBJECT_PROPERTY_NAME = "credentialSubject";
export const ID_PROPERTY_NAME = "id";

export const EDDSA = "EdDSA";

export const JWT_CLAIM_FORMAT_DESIGNATION: ClaimFormatDesignations = {
  jwt_vc: {
    alg: [EDDSA],
  },
  jwt_vp: {
    alg: [EDDSA],
  },
};

export const JWT_VC_CLAIM_FORMAT_DESIGNATION: ClaimFormatDesignations = {
  jwt_vc: {
    alg: [EDDSA],
  },
};

export const JWT_VP_CLAIM_FORMAT_DESIGNATION: ClaimFormatDesignations = {
  jwt_vp: {
    alg: [EDDSA],
  },
};

export const STRING_SCHEMA: DataMappingSchema = { type: "string" };

export const DATE_TIME_SCHEMA: DataMappingSchema = {
  type: "string",
  format: "date-time",
};

export const NUMBER_SCHEMA: DataMappingSchema = { type: "number" };

export const ACTIVE_STATUS_CONSTRAINT: StatusConstraints = {
  active: {
    directive: "required",
  },
};

export const REQUIRED_PREDICATE: ConstraintDirective =
  ConstraintDirective.REQUIRED;

export const stringValueConstraint = (property: string): Field => {
  const fb = new FieldBuilder()
    .path(...attestationConstraintPaths(property))
    .purpose(`The Attestation must contain the field: '${property}'.`)
    .predicate(REQUIRED_PREDICATE)
    .filter({
      ...STRING_SCHEMA,
    });
  return fb.build();
};

export const minimumValueConstraint = (
  property: string,
  minValue: number
): Field => {
  const fb = new FieldBuilder()
    .path(...attestationConstraintPaths(property))
    .purpose(
      `We can only accept credentials where the ${property} value is above ${minValue}.`
    )
    .predicate(REQUIRED_PREDICATE)
    .filter({
      type: "number",
      minimum: minValue,
    });
  return fb.build();
};

/**
 * Creates a field constraint that the VC must be issued by one or multiple specified
 * issuers.
 *
 * Uses an exact (const) JSONSchema if 1 issuer is provided; otherwise uses a pattern to match.
 * @param trustedIssuers
 * @returns
 */
export const trustedIssuerConstraint = (...trustedIssuers: string[]): Field => {
  if (isEmpty(trustedIssuers)) {
    throw new Error("Empty trusted issuers array passed");
  }

  const fb = new FieldBuilder()
    .path(...["$.issuer.id", "$.issuer", "$.vc.issuer", "$.iss"])
    .purpose("This restricts to credentials issued by a trusted issuer.");

  if (trustedIssuers.length > 1) {
    fb.filter({
      ...STRING_SCHEMA,
      pattern: trustedIssuers.map((issuer) => `^${issuer}$`).join("|"),
    });
  } else {
    fb.filter({
      ...STRING_SCHEMA,
      const: trustedIssuers[0],
    });
  }
  return fb.build();
};

/**
 * Adds constraint that input VC uses the schema provided
 *
 * This adds the constraint as a JSONSchema const.
 *
 * TODO: ensure pattern used above will work with VCs with multiple schemas
 * @returns
 */
export const schemaConstraint = (schema: string): Field => {
  if (isEmpty(schema)) {
    throw new Error("No schema was provided");
  }
  const fb = new FieldBuilder()
    .path(
      ...vcConstraintPaths(
        `${CREDENTIAL_SCHEMA_PROPERTY_NAME}.${ID_PROPERTY_NAME}`
      )
    )
    .filter({
      ...STRING_SCHEMA,
      const: schema,
    })
    .purpose("This ensures the credential conforms to the expected schema");
  return fb.build();
};

function attestationConstraintPaths(path: string): string[] {
  return [
    `$.${CREDENTIAL_SUBJECT_PROPERTY_NAME}.${path}`,
    `$.vc.${CREDENTIAL_SUBJECT_PROPERTY_NAME}.${path}`,
    `$.${path}`,
  ];
}

function vcConstraintPaths(path: string): string[] {
  return [`$.${path}`, `$.vc.${path}`];
}
