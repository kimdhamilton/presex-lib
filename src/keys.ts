import {
  getVersion,
  generateEd25519Key,
  keyToDID,
  keyToVerificationMethod,
} from "@spruceid/didkit-wasm-node";

export function getTheVersion() {
  return getVersion();
}

export interface Jwk {
  kty: string;
  crv: string;
  x: string;
  y?: string;
  d: string;
}

export enum DidMethods {
  PKH_ETH = "pkh:eip155:1",
  PKH_WEB = "pkh:eip155",
  KEY = "key",
}

export function didFromKeyAndMethod(method: DidMethods, key: Jwk) {
  const did = keyToDID(method, JSON.stringify(key));
  return did;
}

export function theVMethod(key: string) {
  const verificationMethod = keyToVerificationMethod("key", key);
  return verificationMethod;
}
