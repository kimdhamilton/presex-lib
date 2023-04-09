import * as DidKit from "@spruceid/didkit-wasm-node";
import { DidMethods, Jwk } from ".";
import { keccak256, recoverAddress, toUtf8Bytes } from "ethers";
import jwt from "jsonwebtoken";
const base64url = require("base64url");
import {
  ES256KSigner,
  base64ToBytes,
  hexToBytes,
  base58ToBytes,
  EdDSASigner,
} from "did-jwt";
import { CredentialPayload, Issuer } from "did-jwt-vc";
import { isString } from "lodash";

const hexMatcher = /^(0x)?([a-fA-F0-9]{64}|[a-fA-F0-9]{128})$/;
const base58Matcher = /^([1-9A-HJ-NP-Za-km-z]{44}|[1-9A-HJ-NP-Za-km-z]{88})$/;
const base64Matcher = /^([0-9a-zA-Z=\-_+/]{43}|[0-9a-zA-Z=\-_+/]{86})(={0,2})$/;

export function parseKey(input: string | Uint8Array): Uint8Array {
  if (isString(input)) {
    if (hexMatcher.test(input)) {
      return hexToBytes(input);
    } else if (base58Matcher.test(input)) {
      return base58ToBytes(input);
    } else if (base64Matcher.test(input)) {
      return base64ToBytes(input);
    } else {
      throw TypeError("bad_key: Invalid private key format");
    }
  } else if (input instanceof Uint8Array) {
    return input;
  } else {
    throw TypeError("bad_key: Invalid private key format");
  }
}

/*
// TODO: fix this
export function buildDidJwtIssuer(did: string, privateKey: Uint8Array): Issuer {
  return {
    did,
    signer: ES256KSigner(privateKey),
  };
}*/

export function jwkToDid(method: DidMethods, key: Jwk) {
  const did = DidKit.keyToDID(method, JSON.stringify(key));
  return did;
}

export function jwkToPrivateKeyHex(jwk: Jwk): Uint8Array {
  if (jwk.crv === "Ed25519") {
    const privateKeyPart = Buffer.from(jwk.d, "base64");
    const publicKeyPart = Buffer.from(jwk.x, "base64");
    return Buffer.concat([privateKeyPart, publicKeyPart]);
  }
  if (jwk.crv === "secp256k1") {
    // TODO: is this right?
    return Buffer.from(jwk.d, "base64");
  } else {
    throw new Error("Unsupported curve type");
  }
}

export function buildDidJwtIssuerFromJwk(jwk: Jwk, method: DidMethods): Issuer {
  const did = jwkToDid(method, jwk);
  const privateKey = jwkToPrivateKeyHex(jwk);
  return {
    did,
    signer: EdDSASigner(privateKey),
    alg: "EdDSA",
  };
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
