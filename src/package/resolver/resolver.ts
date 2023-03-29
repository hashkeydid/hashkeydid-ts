import {BigNumber, ethers} from "ethers";
import * as setting from "../../config/config";
import {Error} from "../../error/errors";
import {WalletProvider} from "../../utils/utils";
import {ResolverAbi} from "../../contracts/resolver/resolverAbi";
import {CallOverrides, Overrides} from "@ethersproject/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {ChainInfo, ChainList} from "../../config/config";
import {DIDAbi} from "../../contracts/did/didAbi";
import {ERC721Contract} from "../../contracts/erc721/erc721Contract";
import {ERC1155Contract} from "../../contracts/erc1155/erc1155Contract";
import axios from "axios";

export class DIDImage {
    image: string
}

export class DIDMateData implements DIDImage {
    description: string
    image: string
    name: string
}

export async function NewHashKeyDIDResolver(rpc: string, walletProvider?: WalletProvider): Promise<Resolver> {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const network = await provider.getNetwork()
    const chainId = network.chainId.toString()
    if (!ChainList.has(chainId)) {
        throw Error.ErrNotSupport;
    }
    const chain = ChainList.get(chainId)
    return new Resolver(chain, provider, walletProvider);
}

export class Resolver {
    readonly provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private OnlyReadFlag: boolean = true;
    // private hashkeyDID: HashKeyDID;
    private didContract: ethers.Contract;

    readonly ContractAddr: string

    /**
     * HashKeyDIDResolver constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(chain: ChainInfo, provider: ethers.providers.JsonRpcProvider, walletProvider?: WalletProvider) {
        this.provider = provider
        this.didContract = new ethers.Contract(chain.DIDContract, DIDAbi, this.provider);
        this.ContractAddr = chain.ResolveContract
        if (walletProvider === undefined) {
            this.contract = new ethers.Contract(this.ContractAddr, ResolverAbi, this.provider);
        } else {
            this.SetWalletProvider(walletProvider)
        }
    }

    ContractAddress(): string {
        return this.ContractAddr;
    }

    async WalletAddress(): Promise<string> {
        return this.OnlyReadFlag ? Error.ErrOnlyRead : this.contract.signer.getAddress()
    }

    SetWalletProvider(walletProvider: WalletProvider) {
        let wallet;
        if (walletProvider.privateKey != undefined) {
            wallet = new ethers.Wallet(walletProvider.privateKey, this.provider);
        } else if (walletProvider.mnemonic != undefined) {
            wallet = ethers.Wallet.fromMnemonic(walletProvider.mnemonic).connect(this.provider)
        } else {
            throw "empty"
        }

        if (this.contract == undefined) {
            this.contract = new ethers.Contract(this.ContractAddr, ResolverAbi, wallet);
        } else {
            this.contract = this.contract.connect(wallet)
        }

        this.OnlyReadFlag = false
    }

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
    async SetBlockChainAddress(tokenId: number | bigint | BigNumber | string,
                               coinType: number | string,
                               address: string,
                               overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setAddr(tokenId, coinType, address, overrides);
    }

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
    async SetContentHash(tokenId: number | bigint | BigNumber | string,
                         url: string,
                         overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setContentHash(tokenId, url, overrides);
    }

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
    async SetPubkey(tokenId: number | bigint | BigNumber | string,
                    x: String,
                    y: String,
                    overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setPubkey(tokenId, x, y, overrides);
    }

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
    async SetText(tokenId: number | bigint | BigNumber | string,
                  key: string,
                  value: string,
                  overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setText(tokenId, key, value, overrides);
    }

    /**
     * GetDIDNameByAddr returns the did name by address when user set reverse true
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return did name
     */
    async GetDIDNameByAddr(address: string, overrides: CallOverrides = {}): Promise<string> {
        return this.contract.name(address, overrides);
    }

    /**
     * GetDIDNameByAddrForce returns the did name by address even if reverse is false
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return did name
     */
    async GetDIDNameByAddrForce(address: string, overrides: CallOverrides = {})
        : Promise<string> {
        let isClaimed = await this.didContract.addrClaimed(address, overrides);
        if (!isClaimed) {
            return Error.ErrAddrNotClaimed;
        }
        let tokenId = await this.didContract.tokenOfOwnerByIndex(address, 0, overrides);
        return this.didContract.tokenId2Did(tokenId, overrides);
    }

    /**
     * GetBlockChainAddress returns blockchain address according to coinType
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {number | string} coinType eg: 1:ethereum
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return blockchain address
     */
    async GetBlockChainAddress(tokenId: number | bigint | BigNumber | string,
                               coinType: number | string,
                               overrides: CallOverrides = {})
        : Promise<string> {
        return this.contract.addr(tokenId, coinType, overrides);
    }

    /**
     * GetContentHash returns tokenId's cid
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} content url link
     */
    async GetContentHash(tokenId: number | bigint | BigNumber | string,
                         overrides: CallOverrides = {})
        : Promise<string> {
        return this.contract.contentHash(tokenId, overrides);
    }

    /**
     * GetPublicKey returns tokenId's public key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} public key
     */
    async GetPublicKey(tokenId: number | bigint | BigNumber | string,
                       overrides: CallOverrides = {})
        : Promise<string> {
        return this.contract.pubkey(tokenId, overrides);
    }

    /**
     * Text returns value according to key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {string} key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} string
     */
    async Text(tokenId: number | bigint | BigNumber | string,
               key: string,
               overrides: CallOverrides = {})
        : Promise<string> {
        return this.contract.text(tokenId, key, overrides);
    }

    /**
     * GetMetadataImageByDIDName returns the image url in metadata queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {CallOverrides} [overrides] Note block number, eg: {blockTag: 36513266}
     * @return {promise<string>} return avatar url or Error
     */
    async GetMetadataImageByDIDName(didName: string, overrides: CallOverrides = {}): Promise<string> {
        let res = await this.didContract.did2TokenId(didName, overrides);
        if (res == 0) {
            throw Error.ErrDidNotClaimed;
        }
        let tokenId = await this.didContract.did2TokenId(didName, overrides);
        return this.GetMetadataImage(tokenId);
    }

    /**
     * GetMetadataImageByTokenId returns the image url in metadata queried by tokenId
     *
     * @param {number | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata avatar url
     */
    async GetMetadataImageByTokenId(tokenId: number | BigNumber | string): Promise<string> {
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
        let res = await this.didContract.didClaimed(didName, overrides);
        if (!res) {
            return Error.ErrDidNotClaimed;
        }
        let tokenId = await this.didContract.did2TokenId(didName, overrides);
        let avatarText = await this.contract.text(tokenId, "avatar", overrides);
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
        let avatarText = await this.contract.text(tokenId, "avatar", overrides);
        if (avatarText == "") {
            return Error.ErrAvatarNotSet;
        }
        console.log(1)
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
