import { didFromKeyAndMethod, DidMethods } from "../keys";
import subjectJwk from "./fixtures/subjectJwk.json";

describe("keys", () => {
  it("Test convert to did (did:pkh)", () => {
    const res = didFromKeyAndMethod(DidMethods.PKH_ETH, subjectJwk);
    expect(res).toEqual(
      "did:pkh:eip155:1:0x320a31CC88d067EB5Ce4b17B7A83d6C416D6512a"
    );
  });
});
