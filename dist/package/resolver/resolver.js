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
exports.Resolver = void 0;
var ethers_1 = require("ethers");
var setting = require("../../config/config");
var errors_1 = require("../../error/errors");
var resolverAbi_1 = require("../../contracts/resolver/resolverAbi");
var did_1 = require("../did/did");
var Resolver = /** @class */ (function () {
    /**
     * Resolver constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    function Resolver(walletProvider) {
        this.OnlyReadFlag = true;
        this.hashkeyDID = new did_1.HashKeyDID();
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
        if (walletProvider === undefined) {
            this.contract = new ethers_1.ethers.Contract(setting.DefaultDIDResolverContractAddr, resolverAbi_1.ResolverAbi, this.provider);
        }
        else {
            this.SetWalletProvider(walletProvider);
        }
    }
    Resolver.prototype.ContractAddress = function () {
        return this.contract.address;
    };
    Resolver.prototype.WalletAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.OnlyReadFlag ? errors_1.Error.ErrOnlyRead : this.contract.signer.getAddress()];
            });
        });
    };
    Resolver.prototype.SetWalletProvider = function (walletProvider) {
        console.log(walletProvider);
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
            this.contract = new ethers_1.ethers.Contract(setting.DefaultDIDResolverContractAddr, resolverAbi_1.ResolverAbi, wallet);
        }
        else {
            this.contract = this.contract.connect(wallet);
        }
        this.OnlyReadFlag = false;
    };
    /**
     * SetReverse sets the reverse status for address
     *
     * @param {boolean} status
     * @param {Overrides} [overrides] eg: { gasPrice:1000000000 }
     * @return {Promise<TransactionResponse>} TransactionResponse details
     * @throws Will throw ErrOnlyRead error if the OnlyReadFlag = true
     * @throws Will throw a transaction error when SendTransaction fail
     */
    Resolver.prototype.SetReverse = function (status, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setReverse(status, overrides)];
            });
        });
    };
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
    Resolver.prototype.SetBlockChainAddress = function (tokenId, coinType, address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setAddr(tokenId, coinType, address, overrides)];
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
    Resolver.prototype.SetContentHash = function (tokenId, url, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setContentHash(tokenId, url, overrides)];
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
    Resolver.prototype.SetPubkey = function (tokenId, x, y, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setPubkey(tokenId, x, y, overrides)];
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
    Resolver.prototype.SetText = function (tokenId, key, value, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setText(tokenId, key, value, overrides)];
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
    Resolver.prototype.GetDIDNameByAddr = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isClaimed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashkeyDID.AddrClaimed(address, overrides)];
                    case 1:
                        isClaimed = _a.sent();
                        if (!isClaimed) {
                            return [2 /*return*/, errors_1.Error.ErrAddrNotClaimed];
                        }
                        return [2 /*return*/, this.contract.name(address, overrides)];
                }
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
    Resolver.prototype.GetDIDNameByAddrForce = function (address, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isClaimed, tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashkeyDID.AddrClaimed(address, overrides)];
                    case 1:
                        isClaimed = _a.sent();
                        if (!isClaimed) {
                            return [2 /*return*/, errors_1.Error.ErrAddrNotClaimed];
                        }
                        return [4 /*yield*/, this.hashkeyDID.TokenOfOwnerByIndex(address, 0, overrides)];
                    case 2:
                        tokenId = _a.sent();
                        return [2 /*return*/, this.hashkeyDID.TokenId2Did(tokenId, overrides)];
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
    Resolver.prototype.GetBlockChainAddress = function (tokenId, coinType, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.addr(tokenId, coinType)];
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
    Resolver.prototype.GetContentHash = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.contentHash(tokenId)];
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
    Resolver.prototype.GetPublicKey = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.pubkey(tokenId)];
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
    Resolver.prototype.Text = function (tokenId, key, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.text(tokenId, key)];
            });
        });
    };
    return Resolver;
}());
exports.Resolver = Resolver;
//# sourceMappingURL=resolver.js.map