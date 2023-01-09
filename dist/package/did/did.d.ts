import { BigNumber, ethers } from "ethers";
import { CallOverrides, Overrides } from "@ethersproject/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { WalletProvider } from "../../utils/utils";
export declare class HashKeyDID {
    readonly provider: ethers.providers.JsonRpcProvider;
    private contract;
    private OnlyReadFlag;
    /**
     * HashKeyDID constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(walletProvider?: WalletProvider);
    ContractAddress(): string;
    /**
     * WalletAddress get signer address when OnlyReadFlag is false
     *
     * @return {Promise<string>} signer address or ErrOnlyRead
     */
    WalletAddress(): Promise<string>;
    SetWalletProvider(walletProvider: WalletProvider): void;
    /**
     * Mint mints did with address
     *
     * @param {string} address eg: 20-hex address
     * @param {string} didName eg: xxxxx.key
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    Mint(address: string, didName: string, overrides?: Overrides): Promise<TransactionResponse>;
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
    AddAuth(tokenId: number | bigint | BigNumber | string, address: string, overrides?: Overrides): Promise<TransactionResponse>;
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
    RemoveAuth(tokenId: number | bigint | BigNumber | string, address: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * AddKYC adds KYC information for did
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} KYCProvider eg: 20-hex address
     * @param {number | string} KYCId eg: 1
     * @param {boolean} status eg: true/false
     * @param {number | string} updateTime eg: 16342343423
     * @param {number | string} expireTime eg: 16342343423
     * @param {string} evidence eg: 32-hex string
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    AddKYC(tokenId: number | bigint | BigNumber | string, KYCProvider: string, KYCId: number | string, status: boolean, updateTime: number | string, expireTime: number | string, evidence: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetTokenSupply sets DeedGrain(erc1155) supply number of each tokenId
     *
     * @param {string} DGAddr eg: 20-hex address
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @param {number | string} supply eg: 16342343423
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetTokenSupply(DGAddr: string, tokenId: number | bigint | BigNumber | string, supply: number | string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * MintDG1 mints DeedGrain contract(erc1155) NFT for addresses
     *
     * @param {string} DGAddr eg: 20-hex address
     * @param {number} tokenId eg: 1
     * @param {string[]} addrs eg: [20-hex address...]
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    MintDGV1(DGAddr: string, tokenId: number | bigint | BigNumber | string, addrs: string[], overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * MintDG2 mints DeedGrain contract(erc1155) NFT for addresses
     *
     * @param {string} DGAddr eg: 20-hex address
     * @param {number} tokenId eg: 1
     * @param {string[]} addrs eg: [20-hex address...]
     * @param {string} data eg: ""
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    MintDGV2(DGAddr: string, tokenId: number | bigint | BigNumber | string, addrs: string[], data: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * ClaimDG mints DeedGrain contract(erc1155) NFT
     *
     * @param {string} DGAddr eg: 20-hex address
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @param {string} evidence eg: 32-hex string
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    ClaimDG(DGAddr: string, tokenId: number | bigint | BigNumber | string, evidence: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * IssueDG issues DeedGrain contract(erc1155)
     *
     * @param {string} _name
     * @param {string} _symbol
     * @param {string} _baseUri
     * @param {string} _evidence eg: 32-hex string
     * @param {boolean} _transferable eg: true/false
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    IssueDG(_name: string, _symbol: string, _baseUri: string, _evidence: string, _transferable: boolean, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetNFTSupply Only issuer can set NFT supply
     *
     * @param {string} NFTAddr
     * @param {number | string} supply
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    SetNFTSupply(NFTAddr: string, supply: number | string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * SetNFTBaseUri Only issuer can set NFT's baseuri
     *
     * @param {string} NFTAddr DG NFT contract address
     * @param {string} baseUri All of the NFT's baseuri
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    SetNFTBaseUri(NFTAddr: string, baseUri: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * MintDGNFT Only issuer can airdrop the nft
     *
     * @param {string} NFTAddr DG NFT contract address
     * @param {number | string} sid SeriesId
     * @param {string[]} addrs All the users address to airdrop
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    MintDGNFT(NFTAddr: string, sid: number | string, addrs: string[], overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * ClaimDGNFT User claim the nft
     *
     * @param {string} NFTAddr DG NFT address
     * @param {number | string} sid SeriesId
     * @param {string} evidence Signature
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw transaction error when SendTransaction fail
     */
    ClaimDGNFT(NFTAddr: string, sid: number | string, evidence: string, overrides?: Overrides): Promise<TransactionResponse>;
    /**
     * Did2TokenId returns tokenId by DID
     *
     * @param {string} didName eg: hee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    Did2TokenId(didName: string, overrides?: CallOverrides): Promise<string>;
    /**
     * GetAddrByDIDName returns DID address
     *
     * @param {string} didName
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    GetAddrByDIDName(didName: string, overrides?: CallOverrides): Promise<string>;
    /**
     * VerifyDIDFormat returns checking result about DID format
     *
     * @param {string} didName
     * @return {promise<boolean>} true/false
     */
    VerifyDIDFormat(didName: string): Promise<boolean>;
    /**
     * GetAuthorizedAddrs returns DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string[]>} return addresses
     */
    GetAuthorizedAddrs(tokenId: number | bigint | BigNumber | string, overrides?: CallOverrides): Promise<string[]>;
    /**
     * IsAddrAuthorized returns checking result about DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} return true/false
     */
    IsAddrAuthorized(tokenId: number | bigint | BigNumber | string, address: string, overrides?: CallOverrides): Promise<boolean>;
    /**
     * GetKYCInfo returns DID KYC information
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} KYCProvider eg: 20-hex address
     * @param {number | string} KYCId eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<Object>} transaction details
     */
    GetKYCInfo(tokenId: number | bigint | BigNumber | string, KYCProvider: string, KYCId: number | string, overrides?: CallOverrides): Promise<object>;
    /**
     * DidClaimed returns checking result about DID registered information
     *
     * @param {string} didName eg: kee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    DidClaimed(didName: string, overrides?: CallOverrides): Promise<boolean>;
    /**
     * AddrClaimed returns checking result about address registered information
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    AddrClaimed(address: string, overrides?: CallOverrides): Promise<boolean>;
    /**
     * TokenId2Did returns DID by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} did name
     */
    TokenId2Did(tokenId: number | bigint | BigNumber | string, overrides?: CallOverrides): Promise<string>;
    /**
     * DeedGrainAddrToIssuer returns issuer address by address
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    DeedGrainAddrToIssuer(address: string, overrides?: CallOverrides): Promise<string>;
    /**
     * TokenOfOwnerByIndex See {IERC721Enumerable-tokenOfOwnerByIndex}.
     *
     * @param {string} address eg: 20-hex address
     * @param {number | string} index eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    TokenOfOwnerByIndex(address: string, index: number | string, overrides?: CallOverrides): Promise<string>;
    /**
     * TotalSupply See {IERC721Enumerable-totalSupply}.
     *
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} totalSupply number
     */
    TotalSupply(overrides?: CallOverrides): Promise<string>;
}
