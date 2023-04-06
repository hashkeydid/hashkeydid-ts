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
exports.HashKeyDID = exports.NewHashKeyDID = exports.DIDMateData = exports.DIDImage = void 0;
var ethers_1 = require("ethers");
var setting = require("../config/config");
var didAbi_1 = require("../contracts/did/didAbi");
var errors_1 = require("../error/errors");
var config_1 = require("../config/config");
var resolverAbi_1 = require("../contracts/resolver/resolverAbi");
var axios_1 = require("axios");
var erc721Contract_1 = require("../contracts/erc721/erc721Contract");
var erc1155Contract_1 = require("../contracts/erc1155/erc1155Contract");
var DIDImage = /** @class */ (function () {
    function DIDImage() {
    }
    return DIDImage;
}());
exports.DIDImage = DIDImage;
var DIDMateData = /** @class */ (function () {
    function DIDMateData() {
    }
    return DIDMateData;
}());
exports.DIDMateData = DIDMateData;
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
            this.didContract = new ethers_1.ethers.Contract(this.ContractAddr, didAbi_1.DIDAbi, this.provider);
            this.resolverContract = new ethers_1.ethers.Contract(this.ContractAddr, resolverAbi_1.ResolverAbi, this.provider);
        }
        else {
            this.SetWalletProvider(walletProvider);
        }
    }
    HashKeyDID.prototype.ContractAddress = function () {
        return this.ContractAddr;
    };
    /**
     * WalletAddress get signer address when OnlyReadFlag is false
     *
     * @return {Promise<string>} signer address or ErrOnlyRead
     */
    HashKeyDID.prototype.WalletAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.OnlyReadFlag ? errors_1.Error.ErrOnlyRead : this.didContract.signer.getAddress()];
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
        if (this.didContract == undefined) {
            this.didContract = new ethers_1.ethers.Contract(this.ContractAddr, didAbi_1.DIDAbi, wallet);
            this.resolverContract = new ethers_1.ethers.Contract(this.ContractAddr, resolverAbi_1.ResolverAbi, wallet);
        }
        else {
            this.didContract = this.didContract.connect(wallet);
            this.resolverContract = this.resolverContract.connect(wallet);
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
                return [2 /*return*/, this.didContract.addAuth(tokenId, address, overrides)];
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
                return [2 /*return*/, this.didContract.removeAuth(tokenId, address, overrides)];
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
                return [2 /*return*/, this.didContract.did2TokenId(didName, overrides)];
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
                        return [2 /*return*/, this.didContract.ownerOf(tokenId, overrides)];
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
                    case 0: return [4 /*yield*/, this.didContract.verifyDIDFormat(didName)];
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
                return [2 /*return*/, this.didContract.getAuthorizedAddrs(tokenId, overrides)];
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
                return [2 /*return*/, this.didContract.isAddrAuthorized(tokenId, address, overrides)];
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
                return [2 /*return*/, this.didContract.getKYCInfo(tokenId, KYCProvider, KYCId, overrides)];
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
                return [2 /*return*/, this.didContract.didClaimed(didName, overrides)];
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
                return [2 /*return*/, this.didContract.addrClaimed(address, overrides)];
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
                return [2 /*return*/, this.didContract.tokenId2Did(tokenId, overrides)];
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
                return [2 /*return*/, this.didContract.deedGrainAddrToIssuer(address, overrides)];
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
                return [2 /*return*/, this.didContract.tokenOfOwnerByIndex(address, index, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetBlockChainAddress = function (tokenId, coinType, address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.resolverContract.setAddr(tokenId, coinType, address, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetContentHash = function (tokenId, url, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.resolverContract.setContentHash(tokenId, url, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetPubkey = function (tokenId, x, y, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.resolverContract.setPubkey(tokenId, x, y, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetText = function (tokenId, key, value, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.resolverContract.setText(tokenId, key, value, overrides)];
            });
        });
    };
    /**
     * GetDIDNameByAddr returns the did name by address when user set reverse true
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return did name
     */
    HashKeyDID.prototype.GetDIDNameByAddr = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resolverContract.name(address, overrides)];
            });
        });
    };
    /**
     * GetDIDNameByAddrForce returns the did name by address even if reverse is false
     *
     * @param {string} address 20-hex address
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return did name
     */
    HashKeyDID.prototype.GetDIDNameByAddrForce = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isClaimed, tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.didContract.addrClaimed(address, overrides)];
                    case 1:
                        isClaimed = _a.sent();
                        if (!isClaimed) {
                            return [2 /*return*/, errors_1.Error.ErrAddrNotClaimed];
                        }
                        return [4 /*yield*/, this.didContract.tokenOfOwnerByIndex(address, 0, overrides)];
                    case 2:
                        tokenId = _a.sent();
                        return [2 /*return*/, this.didContract.tokenId2Did(tokenId, overrides)];
                }
            });
        });
    };
    /**
     * GetBlockChainAddress returns blockchain address according to coinType
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {number | string} coinType eg: 1:ethereum
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {Promise<string>} return blockchain address
     */
    HashKeyDID.prototype.GetBlockChainAddress = function (tokenId, coinType, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resolverContract.addr(tokenId, coinType, overrides)];
            });
        });
    };
    /**
     * GetContentHash returns tokenId's cid
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} content url link
     */
    HashKeyDID.prototype.GetContentHash = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resolverContract.contentHash(tokenId, overrides)];
            });
        });
    };
    /**
     * GetPublicKey returns tokenId's public key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} public key
     */
    HashKeyDID.prototype.GetPublicKey = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resolverContract.pubkey(tokenId, overrides)];
            });
        });
    };
    /**
     * Text returns value according to key
     *
     * @param {number | bigint | BigNumber | string} tokenId
     * @param {string} key
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} string
     */
    HashKeyDID.prototype.Text = function (tokenId, key, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resolverContract.text(tokenId, key, overrides)];
            });
        });
    };
    /**
     * GetMetadataImageByDIDName returns the image url in metadata queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {CallOverrides} [overrides] Note block number, eg: {blockTag: 36513266}
     * @return {promise<string>} return avatar url or Error
     */
    HashKeyDID.prototype.GetMetadataImageByDIDName = function (didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res, tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.didContract.did2TokenId(didName, overrides)];
                    case 1:
                        res = _a.sent();
                        if (res == 0) {
                            throw errors_1.Error.ErrDidNotClaimed;
                        }
                        return [4 /*yield*/, this.didContract.did2TokenId(didName, overrides)];
                    case 2:
                        tokenId = _a.sent();
                        return [2 /*return*/, this.GetMetadataImage(tokenId)];
                }
            });
        });
    };
    /**
     * GetMetadataImageByTokenId returns the image url in metadata queried by tokenId
     *
     * @param {number | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata avatar url
     */
    HashKeyDID.prototype.GetMetadataImageByTokenId = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.GetMetadataImage(tokenId)];
            });
        });
    };
    /**
     * GetAvatarByDIDName returns the image url in resolver text queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {string} [chainRpc] eg: https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    HashKeyDID.prototype.GetAvatarByDIDName = function (didName, overrides, chainRpc) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res, tokenId, avatarText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.didContract.didClaimed(didName, overrides)];
                    case 1:
                        res = _a.sent();
                        if (!res) {
                            return [2 /*return*/, errors_1.Error.ErrDidNotClaimed];
                        }
                        return [4 /*yield*/, this.didContract.did2TokenId(didName, overrides)];
                    case 2:
                        tokenId = _a.sent();
                        return [4 /*yield*/, this.resolverContract.text(tokenId, "avatar", overrides)];
                    case 3:
                        avatarText = _a.sent();
                        if (avatarText == "") {
                            return [2 /*return*/, errors_1.Error.ErrAvatarNotSet];
                        }
                        return [2 /*return*/, this.AvatarFormatText2AvatarUrl(avatarText, chainRpc)];
                }
            });
        });
    };
    /**
     * GetAvatarByTokenId returns the image url in resolver text queried by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return avatar url
     */
    HashKeyDID.prototype.GetAvatarByTokenId = function (tokenId, overrides, chainRpc) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var avatarText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolverContract.text(tokenId, "avatar", overrides)];
                    case 1:
                        avatarText = _a.sent();
                        if (avatarText == "") {
                            return [2 /*return*/, errors_1.Error.ErrAvatarNotSet];
                        }
                        console.log(1);
                        return [2 /*return*/, this.AvatarFormatText2AvatarUrl(avatarText, chainRpc)];
                }
            });
        });
    };
    /**
     * AvatarFormatText2AvatarUrl convert avatar format text in resolver to an image url
     *
     * @param {string} formatText eg: nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @return {promise<string>} return image url
     */
    HashKeyDID.prototype.AvatarFormatText2AvatarUrl = function (formatText, chainRpc) {
        return __awaiter(this, void 0, void 0, function () {
            var texts, _a, tokenURI, _b, nft721, nft1155, image;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        texts = formatText.split(":");
                        if (texts.length < 2) {
                            return [2 /*return*/, errors_1.Error.ErrInvalidAvatarText];
                        }
                        _a = texts[0];
                        switch (_a) {
                            case "nft": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        // nft:chainId:type(721/1155):contractAddr:tokenId
                        if (texts.length != 5) {
                            return [2 /*return*/, errors_1.Error.ErrInvalidAvatarText];
                        }
                        if (chainRpc == undefined) {
                            chainRpc = setting.ChainRPCMap.get(texts[1]);
                            if (chainRpc == "") {
                                return [2 /*return*/, errors_1.Error.ErrInvalidAvatarText];
                            }
                        }
                        tokenURI = void 0;
                        _b = texts[2];
                        switch (_b) {
                            case "721": return [3 /*break*/, 2];
                            case "1155": return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        nft721 = (0, erc721Contract_1.ERC721Contract)(chainRpc, texts[3]);
                        return [4 /*yield*/, nft721.tokenURI(texts[4])];
                    case 3:
                        tokenURI = _c.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        nft1155 = (0, erc1155Contract_1.ERC1155Contract)(chainRpc, texts[3]);
                        return [4 /*yield*/, nft1155.uri(texts[4])];
                    case 5:
                        tokenURI = _c.sent();
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, "unsupported token type"];
                    case 7: return [4 /*yield*/, this.GetImageFromTokenURI(tokenURI)];
                    case 8:
                        image = _c.sent();
                        if (image == "") {
                            return [2 /*return*/, errors_1.Error.ErrInvalidTokenURI];
                        }
                        return [2 /*return*/, image];
                    case 9: return [2 /*return*/, formatText];
                }
            });
        });
    };
    /**
     * getImageFromTokenURI parses tokenURI's info to get the image url
     *
     * @param {string} tokenURI eg: https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg
     * @return {promise<string>} return image url
     */
    HashKeyDID.prototype.GetImageFromTokenURI = function (tokenURI) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(tokenURI)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.image];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, errors_1.Error.ErrInvalidTokenURI];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GetMetadata returns the Metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {Promise<DIDMateData>} response json format
     */
    HashKeyDID.prototype.GetMetadata = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var MetadataUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MetadataUrl = "https://api.hashkey.id/did/api/nft/metadata/".concat(tokenId);
                        return [4 /*yield*/, axios_1.default.get(MetadataUrl)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * GetMetadataImage returns the image url in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata image url
     */
    HashKeyDID.prototype.GetMetadataImage = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetMetadata(tokenId)];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, metadata.image == undefined ? "" : metadata.image];
                }
            });
        });
    };
    /**
     * GetMetadataName returns the name in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata name
     */
    HashKeyDID.prototype.GetMetadataName = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetMetadata(tokenId)];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, metadata.name == undefined ? "" : metadata.name];
                }
            });
        });
    };
    /**
     * GetMetadataDescription returns the description in metadata by tokenId
     *
     * @param {number | bigint | BigNumber | string} tokenId eg: 1
     * @return {promise<string>} return metadata description
     */
    HashKeyDID.prototype.GetMetadataDescription = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetMetadata(tokenId)];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, metadata.description == undefined ? "" : metadata.description];
                }
            });
        });
    };
    return HashKeyDID;
}());
exports.HashKeyDID = HashKeyDID;
//# sourceMappingURL=did.js.map