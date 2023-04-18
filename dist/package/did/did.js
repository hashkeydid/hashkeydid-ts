"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashKeyDID = exports.NewHashKeyDID = void 0;
var ethers_1 = require("ethers");
var didAbi_1 = require("../../contracts/did/didAbi");
var errors_1 = require("../../error/errors");
var config_1 = require("../../config/config");
/**
 * NewHashKeyDID constructor
 * @param {string} rpc
 * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
 *
 * @return {Promise<HashKeyDID>} HashKeyDID
 */
function NewHashKeyDID(rpc, walletProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, network, chainId, chain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
                    return [4 /*yield*/, provider.getNetwork()];
                case 1:
                    network = _a.sent();
                    chainId = network.chainId.toString();
                    if (!config_1.ChainList.has(chainId)) {
                        throw errors_1.Error.ErrNotSupport;
                    }
                    chain = config_1.ChainList.get(chainId);
                    return [2 /*return*/, new HashKeyDID(chain, provider, walletProvider)];
            }
        });
    });
}
exports.NewHashKeyDID = NewHashKeyDID;
var HashKeyDID = /** @class */ (function () {
    /**
     * HashKeyDID constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    function HashKeyDID(chain, provider, walletProvider) {
        this.OnlyReadFlag = true;
        this.provider = provider;
        this.ContractAddr = chain.DIDContract;
        if (walletProvider === undefined) {
            this.contract = new ethers_1.ethers.Contract(this.didContractAddr, didAbi_1.DIDAbi, this.provider);
        }
        else {
            this.SetWalletProvider(walletProvider);
        }
    }
    HashKeyDID.prototype.ContractAddress = function () {
        return this.didContractAddr;
    };
    /**
     * WalletAddress get signer address when OnlyReadFlag is false
     *
     * @return {Promise<string>} signer address or ErrOnlyRead
     */
    HashKeyDID.prototype.WalletAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.OnlyReadFlag ? errors_1.Error.ErrOnlyRead : this.contract.signer.getAddress()];
            });
        });
    };
    HashKeyDID.prototype.SetWalletProvider = function (walletProvider) {
        var wallet;
        if (walletProvider.privateKey != undefined) {
            wallet = new ethers_1.ethers.Wallet(walletProvider.privateKey, this.provider);
        }
        else if (walletProvider.mnemonic != undefined) {
            wallet = ethers_1.ethers.Wallet.fromMnemonic(walletProvider.mnemonic).connect(this.provider);
        }
        else {
            throw "empty";
        }
        if (this.contract == undefined) {
            this.contract = new ethers_1.ethers.Contract(this.didContractAddr, didAbi_1.DIDAbi, wallet);
        }
        else {
            this.contract = this.contract.connect(wallet);
        }
        this.OnlyReadFlag = false;
    };
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
    HashKeyDID.prototype.AddAuth = function (tokenId, address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.addAuth(tokenId, address, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.RemoveAuth = function (tokenId, address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.removeAuth(tokenId, address, overrides)];
            });
        });
    };
    /**
     * Did2TokenId returns tokenId by DID
     *
     * @param {string} didName eg: hee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    HashKeyDID.prototype.Did2TokenId = function (didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.did2TokenId(didName, overrides)];
            });
        });
    };
    /**
     * GetAddrByDIDName returns DID address
     *
     * @param {string} didName
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    HashKeyDID.prototype.GetAddrByDIDName = function (didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Did2TokenId(didName)];
                    case 1:
                        tokenId = _a.sent();
                        return [2 /*return*/, this.contract.ownerOf(tokenId, overrides)];
                }
            });
        });
    };
    /**
     * VerifyDIDFormat returns checking result about DID format
     *
     * @param {string} didName
     * @return {promise<boolean>} true/false
     */
    HashKeyDID.prototype.VerifyDIDFormat = function (didName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.verifyDIDFormat(didName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * GetAuthorizedAddrs returns DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string[]>} return addresses
     */
    HashKeyDID.prototype.GetAuthorizedAddrs = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getAuthorizedAddrs(tokenId, overrides)];
            });
        });
    };
    /**
     * IsAddrAuthorized returns checking result about DID authorized addresses
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} return true/false
     */
    HashKeyDID.prototype.IsAddrAuthorized = function (tokenId, address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.isAddrAuthorized(tokenId, address, overrides)];
            });
        });
    };
    /**
     * GetKYCInfo returns DID KYC information
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {string} KYCProvider eg: 20-hex address
     * @param {number | string} KYCId eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<Object>} transaction details
     */
    HashKeyDID.prototype.GetKYCInfo = function (tokenId, KYCProvider, KYCId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getKYCInfo(tokenId, KYCProvider, KYCId, overrides)];
            });
        });
    };
    /**
     * DidClaimed returns checking result about DID registered information
     *
     * @param {string} didName eg: kee.key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    HashKeyDID.prototype.DidClaimed = function (didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.didClaimed(didName, overrides)];
            });
        });
    };
    /**
     * AddrClaimed returns checking result about address registered information
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<boolean>} true/false
     */
    HashKeyDID.prototype.AddrClaimed = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.addrClaimed(address, overrides)];
            });
        });
    };
    /**
     * TokenId2Did returns DID by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 12
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} did name
     */
    HashKeyDID.prototype.TokenId2Did = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.tokenId2Did(tokenId, overrides)];
            });
        });
    };
    /**
     * DeedGrainAddrToIssuer returns issuer address by address
     *
     * @param {string} address eg: 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} address
     */
    HashKeyDID.prototype.DeedGrainAddrToIssuer = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.deedGrainAddrToIssuer(address, overrides)];
            });
        });
    };
    /**
     * TokenOfOwnerByIndex See {IERC721Enumerable-tokenOfOwnerByIndex}.
     *
     * @param {string} address eg: 20-hex address
     * @param {number | string} index eg: 1
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} tokenId
     */
    HashKeyDID.prototype.TokenOfOwnerByIndex = function (address, index, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.tokenOfOwnerByIndex(address, index, overrides)];
            });
        });
    };
    return HashKeyDID;
}());
exports.HashKeyDID = HashKeyDID;
//# sourceMappingURL=did.js.map
