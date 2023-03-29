import {expect} from "chai";
import {NewHashKeyDIDResolver, Resolver} from "./resolver";

describe("DID avatar test", async () => {
    let avatar: Resolver;

    let didName;
    let tokenId;
    let nft721;
    let nft1155;

    before(async () => {
        avatar = await NewHashKeyDIDResolver("https://openapi2.platon.network/rpc")
        didName = "herro.key";
        tokenId = 13756;
        nft721 = "nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619";
        nft1155 = "nft:1:1155:0xf4dd946d1406e215a87029db56c69e1bcf3e1773:1";
    })

    it("Get DID metadata avatar by did", async () => {
        let err1;
        await avatar.GetMetadataImageByDIDName(didName, {blockTag: 36513265})
            .catch(err => {
                err1 = err
            });
        expect(err1).equal("this did name has not been claimed");

        let overrides = {blockTag: 36513266};
        let avatarUrl = await avatar.GetMetadataImageByDIDName(didName, overrides);
        expect(avatarUrl).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
    }).timeout(10000);

    it("Get DID metadata avatar by tokenId", async () => {
        let avatarUrl = await avatar.GetMetadataImageByTokenId(tokenId);
        expect(avatarUrl).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
    }).timeout(10000);

    it("Get DID avatar by did", async () => {
        let result = await avatar.GetAvatarByDIDName(didName);
        expect(result).equal("https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg");
    }).timeout(10000);

    it("Get DID avatar by tokenId", async () => {
        let result = await avatar.GetAvatarByTokenId(tokenId);
        expect(result).equal("https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg");
    }).timeout(10000);

    it("Get avatar by url", async () => {
        // let url = "nft:1:721:0xdb0867214f0a2e129fbc8b72f2898851e28fb09f:1333"
        let result = await avatar.AvatarFormatText2AvatarUrl(nft721);
        expect(result).equal("https://nfts.renga.app/nfts/public/images/8619.jpeg");
        // let result = await avatar.AvatarFormatText2AvatarUrl(nft1155);
        // console.log(result)
    }).timeout(100000);

    it("Get metadata by tokenId", async () => {
        let result = await avatar.GetMetadata(tokenId);
        expect(result.description).equal("Your Passport in the Metaverse");
        expect(result.image).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
        expect(result.name).equal("herro.key");
    }).timeout(10000);

    it("Get metadata image by tokenId", async () => {
        let result = await avatar.GetMetadataImage(tokenId);
        expect(result).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
    }).timeout(10000);

    it("Get metadata name by tokenId", async () => {
        let result = await avatar.GetMetadataName(tokenId);
        expect(result).equal("herro.key");
    }).timeout(10000);

    it("Get metadata description by tokenId", async () => {
        let result = await avatar.GetMetadataDescription(tokenId);
        expect(result).equal("Your Passport in the Metaverse");
    }).timeout(10000);
})
