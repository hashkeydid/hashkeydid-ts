import { BigNumber, ethers } from "ethers";
import { WalletProvider } from "../../utils/utils";
import { CallOverrides, Overrides } from "@ethersproject/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ChainInfo } from "../../config/config";
export declare class DIDImage {
    image: string;
}
export declare class DIDMateData implements DIDImage {
    description: string;
    image: string;
    name: string;
}
export declare function NewHashKeyDIDResolver(rpc: string, walletProvider?: WalletProvider): Promise<Resolver>;
export declare class Resolver {
    readonly provider: ethers.providers.JsonRpcProvider;
    private contract;
    private OnlyReadFlag;
    private didContract;
    readonly ContractAddr: string;
    /**
     * HashKeyDIDResolver constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(chain: ChainInfo, provider: ethers.providers.JsonRpcProvider, walletProvider?: WalletProvider);
    ContractAddress(): string;
    WalletAddress(): Promise<string>;
    SetWalletProvider(walletProvider: WalletProvider): void;
    /**
     * SetBlockChainAddress sets blockchain addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {number | string} coinType
     * @param {string} address
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetBlockChainAddress(tokenId: number | bigint | BigNumber | string, coinType: number | string, address: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetContentHash sets tokenId's cid
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {string} url
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetContentHash(tokenId: number | bigint | BigNumber | string, url: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetPubkey sets tokenId's public key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {string} x
     * @param {string} y
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetPubkey(tokenId: number | bigint | BigNumber | string, x: String, y: String, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetText sets key/value pairs
     *
     * @param {number} tokenId
     * @param {string} key eg: name
     * @param {string} value eg: herro
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetText(tokenId: number | bigint | BigNumber | string, key: string, value: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * GetDIDNameByAddr returns the did name by address when user set reverse true
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return did name
     */
    GetDIDNameByAddr(address: string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetDIDNameByAddrForce returns the did name by address even if reverse is false
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return did name
     */
    GetDIDNameByAddrForce(address: string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetBlockChainAddress returns blockchain address according to coinType
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {number | string} coinType eg: 1:ethereum
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return blockchain address
     */
    GetBlockChainAddress(tokenId: number | bigint | BigNumber | string, coinType: number | string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetContentHash returns tokenId's cid
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} content url link
     */
    GetContentHash(tokenId: number | bigint | BigNumber | string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetPublicKey returns tokenId's public key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} public key
     */
    GetPublicKey(tokenId: number | bigint | BigNumber | string, overrides?: CallOverrides): Promise<string>;
    /**
     * Text returns value according to key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {string} key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} string
     */
    Text(tokenId: number | bigint | BigNumber | string, key: string, overrides?: CallOverrides): Promise<string>;
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
