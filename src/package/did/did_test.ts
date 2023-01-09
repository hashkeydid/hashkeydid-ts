import {expect} from "chai";
import {HashKeyDID} from "./did"

describe("hashkeyDID test", async () => {
    let did;

    let didName;
    let tokenId;
    let authorizedAddr;

    before(async () => {
        did = new HashKeyDID({privateKey: "f3db6526e98e79c7bd1dcadfa15a01e1de5c7293669608f90b92305812222222"});
        tokenId = 13756;
        didName = "herro.key";
        authorizedAddr = "0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c";

    })

    it("Get addr by DID name", async () => {
        let addr = await did.GetAddrByDIDName(didName);
        expect(addr).equal("0xB45c5Eac26AF321dd9C02693418976F52E1219b6");
    }).timeout(100000);

    it("Verify did format", async () => {
        let did1 = "xxx.key1"
        let result = await did.VerifyDIDFormat(did1);
        expect(result).false;
    }).timeout(100000);

    it("Get did authorized addresses", async () => {
        let result = await did.GetAuthorizedAddrs(tokenId);
        expect(result[0]).equal(authorizedAddr);
    }).timeout(10000);

    it("Check did authorized address", async () => {
        let result = await did.IsAddrAuthorized(tokenId, authorizedAddr);
        expect(result).true;
    }).timeout(10000);

    it("Get KYC information", async () => {
        let token = 5945;
        let KYCProvider = "0x0FC1021d0B7111f2170d1183367AAcaC26c68888";
        let KYCId = 2;
        let result = await did.GetKYCInfo(token, KYCProvider, KYCId);
        expect(result[0]).true;
        expect(result[1].toNumber()).equal(1642193640);
        expect(result[2].toNumber()).equal(1705265640);
    }).timeout(10000);

    it("Check if did has already claimed", async () => {
        let result = await did.DidClaimed(didName);
        expect(result).true;
    }).timeout(10000);

    it("Check if address has already claimed", async () => {
        let result = await did.AddrClaimed(authorizedAddr);
        expect(result).true;
    }).timeout(10000);

    it("Get tokenId by did", async () => {
        let result = await did.TokenId2Did(tokenId);
        expect(result).equal(didName);
    }).timeout(10000);

    it("Get did by tokenId", async () => {
        let result = await did.Did2TokenId(didName);
        expect(result).equal(tokenId);
    }).timeout(10000);
})