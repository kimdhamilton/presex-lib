import * as DidKit from "@spruceid/didkit-wasm-node";
import { DidMethods, Jwk } from ".";
import { keccak256, recoverAddress, toUtf8Bytes } from "ethers";
import jwt from "jsonwebtoken";
import { ES256KSigner, EdDSASigner } from "did-jwt";
import { CredentialPayload, Issuer } from "did-jwt-vc";

export function jwkToDid(method: DidMethods, key: Jwk) {
  const did = DidKit.keyToDID(method, JSON.stringify(key));
  return did;
}

export function jwkToPrivateKeyHex(jwk: Jwk): Uint8Array {
  return Buffer.from(jwk.d, "base64");
}

/*
// TODO: fix this
export function buildDidJwtIssuer(did: string, privateKey: Uint8Array): Issuer {
  return {
    did,
    signer: ES256KSigner(privateKey),
  };
}*/

function buildDidJwtIssuer(did: string, privateKey: Uint8Array): Issuer {
  return {
    did,
    signer: EdDSASigner(privateKey),
    alg: "EdDSA",
  };
}

export function buildDidJwtIssuerFromJwk(jwk: Jwk, method: DidMethods): Issuer {
  const did = jwkToDid(method, jwk);
  const privateKey = jwkToPrivateKeyHex(jwk);
  return buildDidJwtIssuer(did, privateKey);
}

export function decodeJwt(jwt: string): CredentialPayload {
  const [header, payload, signature] = jwt.split(".");
  const decoded = Buffer.from(payload, "base64").toString("utf8");
  return JSON.parse(decoded);
}

// TODO: not verified
export function doRecoverAddress(token: string) {
  const decoded = jwt.decode(token, { complete: true });

  const header = decoded!.header;
  const payload = decoded!.payload;
  const signature = decoded!.signature;
  const r = signature.slice(0, 66);
  const s = `0x${signature.slice(66, 130)}`;
  const v = parseInt(signature.slice(130, 132), 16);
  const signatureObject = { r, s, v };

  const signingMessage = keccak256(toUtf8Bytes(`${header}.${payload}`));

  // TODO: need to use signMessage and verifyMessage (or recover)
  const recoveredAddress = recoverAddress(signingMessage, signature);
  return recoveredAddress;
}
