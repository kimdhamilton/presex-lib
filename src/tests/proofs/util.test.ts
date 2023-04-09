import { jwkToDid, DidMethods, jwkToPrivateKeyHex } from "../../proofs";
import subjectJwk from "../fixtures/subjectJwk.json";

describe("util", () => {
  it("Convert JWK to did (did:pkh)", () => {
    const res = jwkToDid(DidMethods.PKH_ETH, subjectJwk);
    expect(res).toEqual(
      "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a"
    );
  });

  it("Convert JWK to hex private key Uint8Array", () => {
    const res = jwkToPrivateKeyHex(subjectJwk);
    const asHexString = Buffer.from(res).toString("hex");
    expect(asHexString).toEqual(
      "1a1ee4423c02a69f22cd7e122af03254fde72ba6c61a90fa452317d0c9953db4"
    );
  });
});
