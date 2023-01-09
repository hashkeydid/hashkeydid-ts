import { BigNumber, ethers } from "ethers";
import { WalletProvider } from "../../utils/utils";
import { CallOverrides, Overrides } from "@ethersproject/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
export declare class Resolver {
    readonly provider: ethers.providers.JsonRpcProvider;
    private contract;
    private OnlyReadFlag;
    private hashkeyDID;
    /**
     * Resolver constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    constructor(walletProvider?: WalletProvider);
    ContractAddress(): string;
    WalletAddress(): Promise<string>;
    SetWalletProvider(walletProvider: WalletProvider): void;
    /**
     * SetReverse sets the reverse status for address
     *
     * @param {boolean} status
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    SetReverse(status: boolean, overrides?: Overrides): Promise<TransactionResponse>;
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
}
