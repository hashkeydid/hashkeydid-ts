import axios from 'axios';
import {Error} from "../../error/errors"
import {CallOverrides} from "@ethersproject/contracts";
import {BigNumber} from "ethers";
import * as setting from "../../config/config"
import {ERC721Contract} from "../../contracts/erc721/erc721Contract";
import {ERC1155Contract} from "../../contracts/erc1155/erc1155Contract";
import {HashKeyDID} from "../did/did";
import {Resolver} from "../resolver/resolver";

export class DIDImage {
    image: string
}

export class DIDMateData implements DIDImage {
    description: string
    image: string
    name: string
}

export class Avatar {
    private hashKeyDID: HashKeyDID;
    private resolver: Resolver;

    constructor() {
        this.hashKeyDID = new HashKeyDID();
        this.resolver = new Resolver();
    }

    /**
     * GetMetadataImageByDIDName returns the image url in metadata queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {CallOverrides} [overrides] Note block number, eg: {blockTag: 36513266}
     * @return {promise<string>} return avatar url or Error
     */
    async GetMetadataImageByDIDName(didName: string, overrides: CallOverrides = {}): Promise<string> {
        let res = await this.hashKeyDID.DidClaimed(didName, overrides);
        if (!res) {
            return Error.ErrDidNotClaimed;
        }
        let tokenId = await this.hashKeyDID.Did2TokenId(didName, overrides);
        return this.GetMetadataImage(tokenId);
    }

    /**
     * GetMetadataImageByTokenId returns the image url in metadata queried by tokenId
     *
     * @param {number | BigNumber | string} tokenId eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    async GetMetadataImageByTokenId(tokenId: number | BigNumber | string, overrides: CallOverrides = {}): Promise<string> {
        let totalSupply = await this.hashKeyDID.TotalSupply(overrides);
        if (tokenId > totalSupply) {
            return Error.ErrTokenIdNotMinted;
        }
        return this.GetMetadataImage(tokenId);
    }

    /**
     * GetAvatarByDIDName returns the image url in resolver text queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {string} [chainRpc] eg: https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    async GetAvatarByDIDName(didName: string, overrides: CallOverrides = {}, chainRpc?: string): Promise<string> {
        let res = await this.hashKeyDID.DidClaimed(didName, overrides);
        if (!res) {
            return Error.ErrDidNotClaimed;
        }
        let tokenId = await this.hashKeyDID.Did2TokenId(didName, overrides);
        let avatarText = await this.resolver.Text(tokenId, "avatar", overrides);
        if (avatarText == "") {
            return Error.ErrAvatarNotSet;
        }
        return this.AvatarFormatText2AvatarUrl(avatarText, chainRpc);
    }

    /**
     * GetAvatarByTokenId returns the image url in resolver text queried by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return avatar url
     */
    async GetAvatarByTokenId(tokenId: number | bigint | BigNumber | string, overrides: CallOverrides = {}, chainRpc?: string): Promise<string> {
        let totalSupply = await this.hashKeyDID.TotalSupply(overrides);
        if (tokenId > totalSupply) {
            return Error.ErrTokenIdNotMinted;
        }
        let avatarText = await this.resolver.Text(tokenId, "avatar", overrides);
        if (avatarText == "") {
            return Error.ErrAvatarNotSet;
        }
        return this.AvatarFormatText2AvatarUrl(avatarText, chainRpc);
    }


    /**
     * AvatarFormatText2AvatarUrl convert avatar format text in resolver to an image url
     *
     * @param {string} formatText eg: nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @return {promise<string>} return image url
     */
    async AvatarFormatText2AvatarUrl(formatText: string, chainRpc?: string): Promise<string> {
        let texts = formatText.split(":");

        if (texts.length < 2) {
            return Error.ErrInvalidAvatarText;
        }

        switch (texts[0]) {
            case "nft":
                // nft:chainId:type(721/1155):contractAddr:tokenId
                if (texts.length != 5) {
                    return Error.ErrInvalidAvatarText;
                }

                if (chainRpc == undefined) {
                    chainRpc = setting.ChainRPCMap.get(texts[1]);
                    if (chainRpc == "") {
                        return Error.ErrInvalidAvatarText;
                    }
                }

                let tokenURI;
                switch (texts[2]) {
                    case "721":
                        let nft721 = ERC721Contract(chainRpc, texts[3]);
                        tokenURI = await nft721.tokenURI(texts[4]);
                        break;
                    case "1155":
                        let nft1155 = ERC1155Contract(chainRpc, texts[3]);
                        tokenURI = await nft1155.uri(texts[4]);
                        break;
                    default:
                        return "unsupported token type";
                }
                let image = await this.GetImageFromTokenURI(tokenURI)
                if (image == "") {
                    return Error.ErrInvalidTokenURI;
                }
                return image;
            default:
                return formatText;
        }
    }

    /**
     * getImageFromTokenURI parses tokenURI's info to get the image url
     *
     * @param {string} tokenURI eg: https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg
     * @return {promise<string>} return image url
     */
    async GetImageFromTokenURI(tokenURI: string): Promise<string> {
        try {
            let response = await axios.get<DIDImage>(tokenURI);
            return response.data.image;
        } catch (e) {
            return Error.ErrInvalidTokenURI;
        }
    }


    /**
     * GetMetadata returns the Metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {Promise<DIDMateData>} response json format
     */
    async GetMetadata(tokenId: number | bigint | BigNumber | string): Promise<DIDMateData> {
        let MetadataUrl = `https://api.hashkey.id/did/api/nft/metadata/${tokenId}`;
        let response = await axios.get<DIDMateData>(MetadataUrl);
        return response.data;
    }


    /**
     * GetMetadataImage returns the image url in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata image url
     */
    async GetMetadataImage(tokenId: number | bigint | BigNumber | string): Promise<string> {
        let metadata = await this.GetMetadata(tokenId);
        return metadata.image == undefined ? "" : metadata.image;
    }

    /**
     * GetMetadataName returns the name in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata name
     */
    async GetMetadataName(tokenId: number | bigint | BigNumber | string): Promise<string> {
        let metadata = await this.GetMetadata(tokenId);
        return metadata.name == undefined ? "" : metadata.name;
    }

    /**
     * GetMetadataDescription returns the description in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata description
     */
    async GetMetadataDescription(tokenId: number | bigint | BigNumber | string): Promise<string> {
        let metadata = await this.GetMetadata(tokenId);
        return metadata.description == undefined ? "" : metadata.description;
    }
}
