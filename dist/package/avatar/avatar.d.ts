import { CallOverrides } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
export declare class DIDImage {
    image: string;
}
export declare class DIDMateData implements DIDImage {
    description: string;
    image: string;
    name: string;
}
export declare class Avatar {
    private hashKeyDID;
    private resolver;
    constructor();
    /**
     * GetMetadataImageByDIDName returns the image url in metadata queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {CallOverrides} [overrides] Note block number, eg: {blockTag: 36513266}
     * @return {promise<string>} return avatar url or Error
     */
    GetMetadataImageByDIDName(didName: string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetMetadataImageByTokenId returns the image url in metadata queried by tokenId
     *
     * @param {number | BigNumber | string} tokenId eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    GetMetadataImageByTokenId(tokenId: number | BigNumber | string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetAvatarByDIDName returns the image url in resolver text queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {string} [chainRpc] eg: https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    GetAvatarByDIDName(didName: string, overrides?: CallOverrides, chainRpc?: string): Promise<string>;
    /**
     * GetAvatarByTokenId returns the image url in resolver text queried by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return avatar url
     */
    GetAvatarByTokenId(tokenId: number | bigint | BigNumber | string, overrides?: CallOverrides, chainRpc?: string): Promise<string>;
    /**
     * AvatarFormatText2AvatarUrl convert avatar format text in resolver to an image url
     *
     * @param {string} formatText eg: nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @return {promise<string>} return image url
     */
    AvatarFormatText2AvatarUrl(formatText: string, chainRpc?: string): Promise<string>;
    /**
     * getImageFromTokenURI parses tokenURI's info to get the image url
     *
     * @param {string} tokenURI eg: https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg
     * @return {promise<string>} return image url
     */
    GetImageFromTokenURI(tokenURI: string): Promise<string>;
    /**
     * GetMetadata returns the Metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {Promise<DIDMateData>} response json format
     */
    GetMetadata(tokenId: number | bigint | BigNumber | string): Promise<DIDMateData>;
    /**
     * GetMetadataImage returns the image url in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata image url
     */
    GetMetadataImage(tokenId: number | bigint | BigNumber | string): Promise<string>;
    /**
     * GetMetadataName returns the name in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata name
     */
    GetMetadataName(tokenId: number | bigint | BigNumber | string): Promise<string>;
    /**
     * GetMetadataDescription returns the description in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata description
     */
    GetMetadataDescription(tokenId: number | bigint | BigNumber | string): Promise<string>;
}
