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
exports.HashKeyDID = void 0;
var ethers_1 = require("ethers");
var setting = require("../../config/config");
var didAbi_1 = require("../../contracts/did/didAbi");
var errors_1 = require("../../error/errors");
var HashKeyDID = /** @class */ (function () {
    /**
     * HashKeyDID constructor
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    function HashKeyDID(walletProvider) {
        this.OnlyReadFlag = true;
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
        if (walletProvider === undefined) {
            this.contract = new ethers_1.ethers.Contract(setting.DefaultDIDContractAddr, didAbi_1.DIDAbi, this.provider);
        }
        else {
            this.SetWalletProvider(walletProvider);
        }
    }
    HashKeyDID.prototype.ContractAddress = function () {
        return this.contract.address;
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
            this.contract = new ethers_1.ethers.Contract(setting.DefaultDIDContractAddr, didAbi_1.DIDAbi, wallet);
        }
        else {
            this.contract = this.contract.connect(wallet);
        }
        this.OnlyReadFlag = false;
    };
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
    HashKeyDID.prototype.Mint = function (address, didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.mint(address, didName, overrides)];
            });
        });
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
    HashKeyDID.prototype.AddKYC = function (tokenId, KYCProvider, KYCId, status, updateTime, expireTime, evidence, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.addKYC(tokenId, KYCProvider, KYCId, status, updateTime, expireTime, evidence, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetTokenSupply = function (DGAddr, tokenId, supply, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setTokenSupply(DGAddr, tokenId, supply, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.MintDGV1 = function (DGAddr, tokenId, addrs, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.mintDGV1(DGAddr, tokenId, addrs, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.MintDGV2 = function (DGAddr, tokenId, addrs, data, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.mintDGV2(DGAddr, tokenId, addrs, data, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.ClaimDG = function (DGAddr, tokenId, evidence, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.claimDG(DGAddr, tokenId, evidence)];
            });
        });
    };
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
    HashKeyDID.prototype.IssueDG = function (_name, _symbol, _baseUri, _evidence, _transferable, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.issueDG(_name, _symbol, _baseUri, _evidence, _transferable, overrides)];
            });
        });
    };
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
    HashKeyDID.prototype.SetNFTSupply = function (NFTAddr, supply, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setNFTSupply(NFTAddr, supply)];
            });
        });
    };
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
    HashKeyDID.prototype.SetNFTBaseUri = function (NFTAddr, baseUri, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.setNFTBaseUri(NFTAddr, baseUri)];
            });
        });
    };
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
    HashKeyDID.prototype.MintDGNFT = function (NFTAddr, sid, addrs, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.mintDGNFT(NFTAddr, sid, addrs)];
            });
        });
    };
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
    HashKeyDID.prototype.ClaimDGNFT = function (NFTAddr, sid, evidence, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.OnlyReadFlag) {
                    throw errors_1.Error.ErrOnlyRead;
                }
                return [2 /*return*/, this.contract.claimDGNFT(NFTAddr, sid, evidence, overrides)];
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
    /**
     * TotalSupply See {IERC721Enumerable-totalSupply}.
     *
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} totalSupply number
     */
    HashKeyDID.prototype.TotalSupply = function (overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.totalSupply(overrides)];
            });
        });
    };
    return HashKeyDID;
}());
exports.HashKeyDID = HashKeyDID;
//# sourceMappingURL=did.js.map