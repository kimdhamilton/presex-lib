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

  describe("jwkToPrivateKeyHex", () => {
    test("Ed25519", () => {
      const jwk = {
        kty: "OKP",
        crv: "Ed25519",
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
        d: "nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A",
        ext: true,
      };

      const privateKeyHex = jwkToPrivateKeyHex(jwk);
      expect(Buffer.from(privateKeyHex).toString("hex")).toBe(
        "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a"
      );
    });

    test("secp256k1", () => {
      // TODO: I don't know if this is right
      const jwk = {
        kty: "EC",
        crv: "secp256k1",
        x: "drJZsEc8LW9QPhJhRdzDWeQhxQ8ItGwYRBvE3KBkZ_c",
        y: "Wk9gTYaZRqMnc6Hq3D0Jw1iKg1R5z5QI-6Eo0B9cGlY",
        d: "2d264ee82e6f8dd60a12d3a3a1d3c464e08938982cf9e3b02ec1eae1f7b1c81b",
        ext: true,
      };

      const privateKeyHex = jwkToPrivateKeyHex(jwk);
      expect(Buffer.from(privateKeyHex).toString("hex")).toBe(
        "d9ddbae1e7bcd9ee9ff1d77ad1ad767776b76b5777738eb87b4f3ddfcf7cd9c7fd7b76f4d9e73579a7b57fb6f573cd5b"
      );
    });

    test("Unsupported curve type", () => {
      const jwk = {
        kty: "EC",
        crv: "P-256",
        x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        y: "4Etl6SRW2YiLUrN5vfvVHuhp7plMxz6JHsx5diaD0zY",
        d: "V8kgd2ZBRuh2dvyE_W8-7W9pXkTkz7rU0rG8QwW13xQ",
        ext: false,
      };

      expect(() => jwkToPrivateKeyHex(jwk)).toThrow("Unsupported curve type");
    });
  });
});
