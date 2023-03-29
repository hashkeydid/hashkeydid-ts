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
exports.Resolver = exports.NewHashKeyDIDResolver = exports.DIDMateData = exports.DIDImage = void 0;
var ethers_1 = require("ethers");
var setting = require("../../config/config");
var errors_1 = require("../../error/errors");
var resolverAbi_1 = require("../../contracts/resolver/resolverAbi");
var config_1 = require("../../config/config");
var didAbi_1 = require("../../contracts/did/didAbi");
var erc721Contract_1 = require("../../contracts/erc721/erc721Contract");
var erc1155Contract_1 = require("../../contracts/erc1155/erc1155Contract");
var axios_1 = require("axios");
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
function NewHashKeyDIDResolver(rpc, walletProvider) {
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
                    return [2 /*return*/, new Resolver(chain, provider, walletProvider)];
            }
        });
    });
}
exports.NewHashKeyDIDResolver = NewHashKeyDIDResolver;
var Resolver = /** @class */ (function () {
    /**
     * HashKeyDIDResolver constructor
     * @param {ChainInfo} chain
     * @param {ethers.providers.JsonRpcProvider} provider ethers.providers.JsonRpcProvider
     * @param {WalletProvider} [walletProvider] wallet Provider eg: {privateKey:""} or {mnemonic:""}
     */
    function Resolver(chain, provider, walletProvider) {
        this.OnlyReadFlag = true;
        this.provider = provider;
        this.didContract = new ethers_1.ethers.Contract(chain.DIDContract, didAbi_1.DIDAbi, this.provider);
        this.ContractAddr = chain.ResolveContract;
        if (walletProvider === undefined) {
            this.contract = new ethers_1.ethers.Contract(this.ContractAddr, resolverAbi_1.ResolverAbi, this.provider);
        }
        else {
            this.SetWalletProvider(walletProvider);
        }
    }
    Resolver.prototype.ContractAddress = function () {
        return this.ContractAddr;
    };
    Resolver.prototype.WalletAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.OnlyReadFlag ? errors_1.Error.ErrOnlyRead : this.contract.signer.getAddress()];
            });
        });
    };
    Resolver.prototype.SetWalletProvider = function (walletProvider) {
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
            this.contract = new ethers_1.ethers.Contract(this.ContractAddr, resolverAbi_1.ResolverAbi, wallet);
        }
        else {
            this.contract = this.contract.connect(wallet);
        }
        this.OnlyReadFlag = false;
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
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.name(address, overrides)];
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
    Resolver.prototype.GetBlockChainAddress = function (tokenId, coinType, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.addr(tokenId, coinType, overrides)];
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
                return [2 /*return*/, this.contract.contentHash(tokenId, overrides)];
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
                return [2 /*return*/, this.contract.pubkey(tokenId, overrides)];
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
                return [2 /*return*/, this.contract.text(tokenId, key, overrides)];
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
    Resolver.prototype.GetMetadataImageByDIDName = function (didName, overrides) {
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
    Resolver.prototype.GetMetadataImageByTokenId = function (tokenId) {
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
    Resolver.prototype.GetAvatarByDIDName = function (didName, overrides, chainRpc) {
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
                        return [4 /*yield*/, this.contract.text(tokenId, "avatar", overrides)];
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
    Resolver.prototype.GetAvatarByTokenId = function (tokenId, overrides, chainRpc) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var avatarText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.text(tokenId, "avatar", overrides)];
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
    Resolver.prototype.AvatarFormatText2AvatarUrl = function (formatText, chainRpc) {
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
    Resolver.prototype.GetImageFromTokenURI = function (tokenURI) {
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
    Resolver.prototype.GetMetadata = function (tokenId) {
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
    Resolver.prototype.GetMetadataImage = function (tokenId) {
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
    Resolver.prototype.GetMetadataName = function (tokenId) {
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
    Resolver.prototype.GetMetadataDescription = function (tokenId) {
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
    return Resolver;
}());
exports.Resolver = Resolver;
//# sourceMappingURL=resolver.js.map