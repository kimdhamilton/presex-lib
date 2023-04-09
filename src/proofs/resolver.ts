import {
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolver,
} from "did-resolver";
import * as DidKit from "@spruceid/didkit-wasm-node";

import { getResolver as getWebResolver } from "web-did-resolver";
import { getResolver as getKeyResolver } from "key-did-resolver";

const didWebResolver = getWebResolver();
const didKeyResolver = getKeyResolver();

export function getPkhResolver(): Record<string, DIDResolver> {
  async function resolve(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDResolutionResult> {
    console.log(parsed);
    // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path', fragment: 'fragment=123'}
    const didDoc = await DidKit.resolveDID(did, "{}"); // lookup doc

    // If you need to lookup another did as part of resolving this did document, the primary DIDResolver object is passed in as well
    //const parentDID = await didResolver.resolve(...)
    // Return the DIDResolutionResult object
    //  return {
    // didResolutionMetadata: { contentType: 'application/did+ld+json' },
    // didDocument: didDoc,
    // didDocumentMetadata: { ... }
    //  };
    return didDoc;
  }

  return { pkh: resolve };
}

const didPkhResolver = getPkhResolver();

export const didResolver = new Resolver({
  ...didWebResolver,
  ...didKeyResolver,
  //...didPkhResolver,
});
