import {BigNumber, ethers} from "ethers";
import {DIDAbi} from "../../contracts/did/didAbi";
import {CallOverrides, Overrides} from "@ethersproject/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {Error} from "../../error/errors";
import {WalletProvider} from "../../utils/utils";
import {ChainInfo, ChainList} from "../../config/config";

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
    private contract: ethers.Contract;
    private OnlyReadFlag: boolean = true;

    readonly ContractAddr: string

    /**
     * HashKeyDID constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(chain: ChainInfo, provider: ethers.providers.JsonRpcProvider, walletProvider?: WalletProvider) {
        this.provider = provider;
        this.ContractAddr = chain.DIDContract

        if (walletProvider === undefined) {
            this.contract = new ethers.Contract(this.ContractAddr, DIDAbi, this.provider);
        } else {
            this.SetWalletProvider(walletProvider)
        }
    }

    ContractAddress(): string {
        return this.ContractAddr;
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
            this.contract = new ethers.Contract(this.ContractAddr, DIDAbi, wallet);
        } else {
            this.contract = this.contract.connect(wallet)
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
     * Did2TokenId returns tokenId by DID
     *
     * @param {string} didName eg: hee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    async Did2TokenId(didName: string, overrides: CallOverrides = {}): Promise<BigNumber> {
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
}
