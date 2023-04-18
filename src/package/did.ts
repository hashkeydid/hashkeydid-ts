import {BigNumber, ethers} from "ethers";
import {DIDAbi} from "../contracts/did/didAbi";
import {CallOverrides, Overrides} from "@ethersproject/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {Error} from "../error/errors";
import {WalletProvider} from "../utils/utils";
import {ChainInfo, ChainList, ChainRPCMap} from "../config/config";
import {ResolverAbi} from "../contracts/resolver/resolverAbi";
import axios from "axios";
import {ERC721Contract} from "../contracts/erc721/erc721Contract";
import {ERC1155Contract} from "../contracts/erc1155/erc1155Contract";

export class DIDImage {
    image: string
}

export class DIDMateData implements DIDImage {
    description: string
    image: string
    name: string
}

/**
 * NewHashKeyDID constructor
 * @param {string} rpc
 * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
 *
 * @return {Promise<HashKeyDID>} HashKeyDID
 */
export async function NewHashKeyDID(rpc: string, walletProvider?: WalletProvider): Promise<HashKeyDID> {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const network = await provider.getNetwork()
    const chainId = network.chainId.toString()
    if (!ChainList.has(chainId)) {
        throw Error.ErrNotSupport;
    }
    const chain = ChainList.get(chainId)
    return new HashKeyDID(chain, provider, walletProvider);
}

export class HashKeyDID {

    readonly provider: ethers.providers.JsonRpcProvider;
    private didContract: ethers.Contract;
    private resolverContract: ethers.Contract;
    private OnlyReadFlag: boolean = true;

    readonly didContractAddr: string
    readonly resolveContractAddr: string

    /**
     * HashKeyDID constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(chain: ChainInfo, provider: ethers.providers.JsonRpcProvider, walletProvider?: WalletProvider) {
        this.provider = provider;
        this.didContractAddr = chain.DIDContract
        this.resolveContractAddr = chain.ResolveContract

        if (walletProvider === undefined) {
            this.didContract = new ethers.Contract(this.didContractAddr, DIDAbi, this.provider);
            this.resolverContract = new ethers.Contract(this.resolveContractAddr, ResolverAbi, this.provider);
        } else {
            this.SetWalletProvider(walletProvider)
        }
    }

    DIDContractAddress(): string {
        return this.didContractAddr;
    }

    ResolveContractAddress(): string {
        return this.resolveContractAddr;
    }

    /**
     * WalletAddress get signer address when OnlyReadFlag is false
     *
     * @return {Promise<string>} signer address or ErrOnlyRead
     */
    async WalletAddress(): Promise<string> {
        return this.OnlyReadFlag ? Error.ErrOnlyRead : this.didContract.signer.getAddress()
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

        if (this.didContract == undefined) {
            this.didContract = new ethers.Contract(this.didContractAddr, DIDAbi, wallet);
            this.resolverContract = new ethers.Contract(this.resolveContractAddr, ResolverAbi, wallet);
        } else {
            this.didContract = this.didContract.connect(wallet)
            this.resolverContract = this.resolverContract.connect(wallet)
        }

        this.OnlyReadFlag = false
    }

    /**
     * AddAuth adds address to tokenId authorized address list
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} address eg: 20-hex address
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    async AddAuth(tokenId: number | bigint | BigNumber | string,
                  address: string,
                  overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.didContract.addAuth(tokenId, address, overrides);
    }

    /**
     * RemoveAuth removes address from tokenId authorized address list
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} address eg: 20-hex address
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    async RemoveAuth(tokenId: number | bigint | BigNumber | string,
                     address: string,
                     overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.didContract.removeAuth(tokenId, address, overrides);
    }

    /**
     * Did2TokenId returns tokenId by DID
     *
     * @param {string} didName eg: hee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    async Did2TokenId(didName: string, overrides: CallOverrides = {}): Promise<BigNumber> {
        return this.didContract.did2TokenId(didName, overrides);
    }

    /**
     * GetAddrByDIDName returns DID address
     *
     * @param {string} didName
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    async GetAddrByDIDName(didName: string, overrides: CallOverrides = {}): Promise<string> {
        let tokenId = await this.Did2TokenId(didName);
        return this.didContract.ownerOf(tokenId, overrides);
    }

    /**
     * VerifyDIDFormat returns checking result about DID format
     *
     * @param {string} didName
     * @return {promise<boolean>} true/false
     */
    async VerifyDIDFormat(didName: string): Promise<boolean> {
        return await this.didContract.verifyDIDFormat(didName);
    }

    /**
     * GetAuthorizedAddrs returns DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string[]>} return addresses
     */
    async GetAuthorizedAddrs(tokenId: number | bigint | BigNumber | string,
                             overrides: CallOverrides = {})
        : Promise<string[]> {
        return this.didContract.getAuthorizedAddrs(tokenId, overrides);
    }

    /**
     * IsAddrAuthorized returns checking result about DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} return true/false
     */
    async IsAddrAuthorized(tokenId: number | bigint | BigNumber | string,
                           address: string,
                           overrides: CallOverrides = {})
        : Promise<boolean> {
        return this.didContract.isAddrAuthorized(tokenId, address, overrides);
    }

    /**
     * GetKYCInfo returns DID KYC information
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} KYCProvider eg: 20-hex address
     * @param {number | string} KYCId eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<Object>} transaction details
     */
    async GetKYCInfo(tokenId: number | bigint | BigNumber | string,
                     KYCProvider: string,
                     KYCId: number | string,
                     overrides: CallOverrides = {})
        : Promise<object> {
        return this.didContract.getKYCInfo(tokenId, KYCProvider, KYCId, overrides);
    }

    /**
     * DidClaimed returns checking result about DID registered information
     *
     * @param {string} didName eg: kee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    async DidClaimed(didName: string, overrides: CallOverrides = {}): Promise<boolean> {
        return this.didContract.didClaimed(didName, overrides);
    }

    /**
     * AddrClaimed returns checking result about address registered information
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    async AddrClaimed(address: string, overrides: CallOverrides = {}): Promise<boolean> {
        return this.didContract.addrClaimed(address, overrides);
    }

    /**
     * TokenId2Did returns DID by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} did name
     */
    async TokenId2Did(tokenId: number | bigint | BigNumber | string, overrides: CallOverrides = {})
        : Promise<string> {
        return this.didContract.tokenId2Did(tokenId, overrides);
    }


    /**
     * DeedGrainAddrToIssuer returns issuer address by address
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    async DeedGrainAddrToIssuer(address: string, overrides: CallOverrides = {}): Promise<string> {
        return this.didContract.deedGrainAddrToIssuer(address, overrides);
    }

    /**
     * TokenOfOwnerByIndex See {IERC721Enumerable-tokenOfOwnerByIndex}.
     *
     * @param {string} address eg: 20-hex address
     * @param {number | string} index eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    async TokenOfOwnerByIndex(address: string,
                              index: number | string,
                              overrides: CallOverrides = {})
        : Promise<string> {
        return this.didContract.tokenOfOwnerByIndex(address, index, overrides);
    }

    /*************************************************/
    /********************resolver*********************/

    /*************************************************/

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
        return this.resolverContract.setAddr(tokenId, coinType, address, overrides);
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
        return this.resolverContract.setContentHash(tokenId, url, overrides);
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
        return this.resolverContract.setPubkey(tokenId, x, y, overrides);
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
        return this.resolverContract.setText(tokenId, key, value, overrides);
    }

    /**
     * GetDIDNameByAddr returns the did name by address when user set reverse true
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return did name
     */
    async GetDIDNameByAddr(address: string, overrides: CallOverrides = {}): Promise<string> {
        return this.resolverContract.name(address, overrides);
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
        return this.resolverContract.addr(tokenId, coinType, overrides);
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
        return this.resolverContract.contentHash(tokenId, overrides);
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
        return this.resolverContract.pubkey(tokenId, overrides);
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
        return this.resolverContract.text(tokenId, key, overrides);
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
        let avatarText = await this.resolverContract.text(tokenId, "avatar", overrides);
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
        let avatarText = await this.resolverContract.text(tokenId, "avatar", overrides);
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
                    chainRpc = ChainRPCMap.get(texts[1]);
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
