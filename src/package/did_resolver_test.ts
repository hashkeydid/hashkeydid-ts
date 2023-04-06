import {expect} from "chai";
import {Error} from "../error/errors"
import {HashKeyDID, NewHashKeyDID} from "./did";

describe("DIDResolver test", async () => {
    let address
    let didName;
    let tokenId;
    let authorizedAddr;

    let resolver: HashKeyDID;

    before(async () => {
        resolver = await NewHashKeyDID("https://openapi2.platon.network/rpc",{privateKey:"f3db6526e98e79c7bd1dcadfa15a01e1de5c7293669608f90b9230581047cbc4"});
        tokenId = 13756;
        didName = "herro.key";
        authorizedAddr = "0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c";
        address = await resolver.WalletAddress();
    })

    it("Get DID name when reverse is false", async () => {
        try {
            await resolver.GetDIDNameByAddr("0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c");
        } catch (e) {
            expect(e.reason).equal(Error.ErrAddrNotSetReverse);
        }
    }).timeout(100000);

    it("Get DID name force when reverse is false, and set block height", async () => {
        let overrides = {"blockTag": 36513266};
        let result = await resolver.GetDIDNameByAddrForce(address, overrides)
        expect(result).equal("herro.key");

        overrides = {"blockTag": 36513264};
        result = await resolver.GetDIDNameByAddrForce(address, overrides);
        expect(result).equal("this addr has not claimed a did");
    }).timeout(100000);

    it("Get blockchain address", async () => {
        // set address
        // await resolver.SetBlockChainAddress(tokenId, 1, "0xb45c5eac26af321dd9c02693418976f52e1219b6");
        // read address
        let result = await resolver.GetBlockChainAddress(tokenId, 1);
        expect(result).equal("0xb45c5eac26af321dd9c02693418976f52e1219b6");
    }).timeout(100000);

    it("Get content value", async () => {
        // read content
        let result = await resolver.GetContentHash(tokenId);
        expect(result).equal("0x1234");
    }).timeout(100000);
    //
    it("Get public key", async () => {
        // set pubkey
        // await resolver.SetPubkey(tokenId, "0x0000000000000000000000000000000000000000000000000000000000000003", "0x0000000000000000000000000000000000000000000000000000000000000004");
        // read pubkey
        let result = await resolver.GetPublicKey(tokenId);
        expect(result[0]).equal("0x0000000000000000000000000000000000000000000000000000000000000003");
        expect(result[1]).equal("0x0000000000000000000000000000000000000000000000000000000000000004");
        // console.log(result);
    }).timeout(100000);

    it("Get value by key", async () => {
        // await resolver.SetText(tokenId, "name", "herro");

        let result = await resolver.Text(tokenId, "name");
        expect(result).equal("咚咚咚");
        // console.log(result);
    }).timeout(100000);
})