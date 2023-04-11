export interface ClaimFormatDesignationAlg {
  alg: string[];
}

export interface ClaimFormatDesignationProof {
  proof_type: string[];
}

// Note: not extensible
export interface ClaimFormatDesignations {
  jwt?: ClaimFormatDesignationAlg; // TODO: or JwtFormat?
  jwt_vc?: ClaimFormatDesignationAlg;
  jwt_vp?: ClaimFormatDesignationAlg;
  ldp_vc?: ClaimFormatDesignationProof; // TODO: or LdpFormat?
  ldp_vp?: ClaimFormatDesignationProof;
  ldp?: ClaimFormatDesignationProof;
}
