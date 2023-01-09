import {BigNumber, ethers} from "ethers";
import * as setting from "../../config/config"
import {DIDAbi} from "../../contracts/did/didAbi";
import {CallOverrides, Overrides} from "@ethersproject/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {Error} from "../../error/errors";
import {WalletProvider} from "../../utils/utils";


export class HashKeyDID {

    readonly provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private OnlyReadFlag: boolean = true;

    /**
     * HashKeyDID constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(walletProvider?: WalletProvider) {
        this.provider = new ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
        if (walletProvider === undefined) {
            this.contract = new ethers.Contract(setting.DefaultDIDContractAddr, DIDAbi, this.provider);
        } else {
            this.SetWalletProvider(walletProvider)
        }
    }

    ContractAddress(): string {
        return this.contract.address;
    }

    /**
     * WalletAddress get signer address when OnlyReadFlag is false
     *
     * @return {Promise<string>} signer address or ErrOnlyRead
     */
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
            this.contract = new ethers.Contract(setting.DefaultDIDContractAddr, DIDAbi, wallet);
        } else {
            this.contract = this.contract.connect(wallet)
        }

        this.OnlyReadFlag = false
    }

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
    async Mint(address: string, didName: string, overrides: Overrides = {}): Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.mint(address, didName, overrides);
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
        return this.contract.addAuth(tokenId, address, overrides);
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
        return this.contract.removeAuth(tokenId, address, overrides);
    }

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
    async AddKYC(tokenId: number | bigint | BigNumber | string,
                 KYCProvider: string,
                 KYCId: number | string,
                 status: boolean,
                 updateTime: number | string,
                 expireTime: number | string,
                 evidence: string,
                 overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.addKYC(tokenId, KYCProvider, KYCId, status, updateTime, expireTime, evidence, overrides);
    }

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
    async SetTokenSupply(DGAddr: string,
                         tokenId: number | bigint | BigNumber | string,
                         supply: number | string,
                         overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setTokenSupply(DGAddr, tokenId, supply, overrides);
    }

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
    async MintDGV1(DGAddr: string,
                   tokenId: number | bigint | BigNumber | string,
                   addrs: string[],
                   overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.mintDGV1(DGAddr, tokenId, addrs, overrides);
    }

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
    async MintDGV2(DGAddr: string,
                   tokenId: number | bigint | BigNumber | string,
                   addrs: string[],
                   data: string,
                   overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.mintDGV2(DGAddr, tokenId, addrs, data, overrides);
    }

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
    async ClaimDG(DGAddr: string,
                  tokenId: number | bigint | BigNumber | string,
                  evidence: string,
                  overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.claimDG(DGAddr, tokenId, evidence);
    }

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
    async IssueDG(_name: string,
                  _symbol: string,
                  _baseUri: string,
                  _evidence: string,
                  _transferable: boolean,
                  overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.issueDG(_name, _symbol, _baseUri, _evidence, _transferable, overrides);
    }

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
    async SetNFTSupply(NFTAddr: string, supply: number | string, overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setNFTSupply(NFTAddr, supply);
    }

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
    async SetNFTBaseUri(NFTAddr: string, baseUri: string, overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setNFTBaseUri(NFTAddr, baseUri);
    }

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
    async MintDGNFT(NFTAddr: string, sid: number | string, addrs: string[], overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.mintDGNFT(NFTAddr, sid, addrs);
    }

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
    async ClaimDGNFT(NFTAddr: string, sid: number | string, evidence: string, overrides: Overrides = {})
        : Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.claimDGNFT(NFTAddr, sid, evidence, overrides);
    }

    /**
     * Did2TokenId returns tokenId by DID
     *
     * @param {string} didName eg: hee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    async Did2TokenId(didName: string, overrides: CallOverrides = {}): Promise<string> {
        return this.contract.did2TokenId(didName, overrides);
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
        return this.contract.ownerOf(tokenId, overrides);
    }

    /**
     * VerifyDIDFormat returns checking result about DID format
     *
     * @param {string} didName
     * @return {promise<boolean>} true/false
     */
    async VerifyDIDFormat(didName: string): Promise<boolean> {
        return await this.contract.verifyDIDFormat(didName);
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
        return this.contract.getAuthorizedAddrs(tokenId, overrides);
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
        return this.contract.isAddrAuthorized(tokenId, address, overrides);
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
        return this.contract.getKYCInfo(tokenId, KYCProvider, KYCId, overrides);
    }

    /**
     * DidClaimed returns checking result about DID registered information
     *
     * @param {string} didName eg: kee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    async DidClaimed(didName: string, overrides: CallOverrides = {}): Promise<boolean> {
        return this.contract.didClaimed(didName, overrides);
    }

    /**
     * AddrClaimed returns checking result about address registered information
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    async AddrClaimed(address: string, overrides: CallOverrides = {}): Promise<boolean> {
        return this.contract.addrClaimed(address, overrides);
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
        return this.contract.tokenId2Did(tokenId, overrides);
    }


    /**
     * DeedGrainAddrToIssuer returns issuer address by address
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    async DeedGrainAddrToIssuer(address: string, overrides: CallOverrides = {}): Promise<string> {
        return this.contract.deedGrainAddrToIssuer(address, overrides);
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
        return this.contract.tokenOfOwnerByIndex(address, index, overrides);
    }

    /**
     * TotalSupply See {IERC721Enumerable-totalSupply}.
     *
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} totalSupply number
     */
    async TotalSupply(overrides: CallOverrides = {}): Promise<string> {
        return this.contract.totalSupply(overrides);
    }
}