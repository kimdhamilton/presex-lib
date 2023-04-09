import { createHash } from "crypto";
import { Signer } from "did-jwt";
import { Issuer } from "did-jwt-vc";
import { jwkToDid, jwkToPrivateKeyHex } from "./util";
import * as secp256k1 from "secp256k1";

export interface Jwk {
  kty: string;
  crv: string;
  x: string;
  y?: string;
  d: string;
}

export enum DidMethods {
  PKH_ETH = "pkh:eip155:1",
  PKH_WEB = "web",
  KEY = "key",
}

export enum ProofFormats {
  JWT = "jwt",
  LD_PROOF = "ldp",
}

// TODO: unused currently
export class EcdsaSecp256k1RecoveryIssuer implements Issuer {
  did: string;
  signer: Signer;
  alg?: string;

  constructor(key: Jwk, alg: string = "ES256K-R") {
    //this.did = `did:pkh:eip155:1:${wallet.address}`;
    this.did = jwkToDid(DidMethods.PKH_ETH, key);
    const pk = jwkToPrivateKeyHex(key);
    const pkstr = Buffer.from(pk).toString("hex");
    this.alg = alg;

    this.signer = async (data: string | Uint8Array) => {
      const message =
        typeof data === "string" ? new TextEncoder().encode(data) : data;
      // const messageHash = new Uint8Array(32);
      const messageHash = createHash("sha256").update(message).digest();
      const signatureObj = secp256k1.ecdsaSign(messageHash, pk);

      return {
        r: Buffer.from(signatureObj.signature.slice(0, 32)).toString("hex"),
        s: Buffer.from(signatureObj.signature.slice(32)).toString("hex"),
        recoveryParam: signatureObj.recid,
      };
    };
  }
}
