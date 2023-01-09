import {BigNumber, ethers} from "ethers";
import * as setting from "../../config/config";
import {Error} from "../../error/errors";
import {WalletProvider} from "../../utils/utils";
import {ResolverAbi} from "../../contracts/resolver/resolverAbi";
import {CallOverrides, Overrides} from "@ethersproject/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {HashKeyDID} from "../did/did";

export class Resolver {

    readonly provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private OnlyReadFlag: boolean = true;
    private hashkeyDID: HashKeyDID;

    /**
     * Resolver constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(walletProvider?: WalletProvider) {
        this.hashkeyDID = new HashKeyDID();
        this.provider = new ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
        if (walletProvider === undefined) {
            this.contract = new ethers.Contract(setting.DefaultDIDResolverContractAddr, ResolverAbi, this.provider);
        } else {
            this.SetWalletProvider(walletProvider)
        }
    }

    ContractAddress(): string {
        return this.contract.address;
    }

    async WalletAddress(): Promise<string> {
        return this.OnlyReadFlag ? Error.ErrOnlyRead : this.contract.signer.getAddress()
    }

    SetWalletProvider(walletProvider: WalletProvider) {
        console.log(walletProvider)
        let wallet;
        if (walletProvider.privateKey != undefined) {
            wallet = new ethers.Wallet(walletProvider.privateKey, this.provider);
        } else if (walletProvider.mnemonic != undefined) {
            wallet = ethers.Wallet.fromMnemonic(walletProvider.mnemonic).connect(this.provider)
        } else {
            throw "empty"
        }

        if (this.contract == undefined) {
            this.contract = new ethers.Contract(setting.DefaultDIDResolverContractAddr, ResolverAbi, wallet);
        } else {
            this.contract = this.contract.connect(wallet)
        }

        this.OnlyReadFlag = false
    }

    /**
     * SetReverse sets the reverse status for address
     *
     * @param {boolean} status
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    async SetReverse(status: boolean, overrides: Overrides = {}): Promise<TransactionResponse> {
        if (this.OnlyReadFlag) {
            throw Error.ErrOnlyRead;
        }
        return this.contract.setReverse(status, overrides);
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
        let isClaimed = await this.hashkeyDID.AddrClaimed(address, overrides);
        if (!isClaimed) {
            return Error.ErrAddrNotClaimed;
        }
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
        let isClaimed = await this.hashkeyDID.AddrClaimed(address, overrides);
        if (!isClaimed) {
            return Error.ErrAddrNotClaimed;
        }
        let tokenId = await this.hashkeyDID.TokenOfOwnerByIndex(address, 0, overrides);
        return this.hashkeyDID.TokenId2Did(tokenId, overrides);
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
        return this.contract.addr(tokenId, coinType);
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
        return this.contract.contentHash(tokenId);
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
        return this.contract.pubkey(tokenId);
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
        return this.contract.text(tokenId, key);
    }
}