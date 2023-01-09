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
exports.Avatar = exports.DIDMateData = exports.DIDImage = void 0;
var axios_1 = require("axios");
var errors_1 = require("../../error/errors");
var setting = require("../../config/config");
var erc721Contract_1 = require("../../contracts/erc721/erc721Contract");
var erc1155Contract_1 = require("../../contracts/erc1155/erc1155Contract");
var did_1 = require("../did/did");
var resolver_1 = require("../resolver/resolver");
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
var Avatar = /** @class */ (function () {
    function Avatar() {
        this.hashKeyDID = new did_1.HashKeyDID();
        this.resolver = new resolver_1.Resolver();
    }
    /**
     * GetMetadataImageByDIDName returns the image url in metadata queried by did name
     *
     * @param {string} didName eg: herro.key
     * @param {CallOverrides} [overrides] Note block number, eg: {blockTag: 36513266}
     * @return {promise<string>} return avatar url or Error
     */
    Avatar.prototype.GetMetadataImageByDIDName = function (didName, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res, tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashKeyDID.DidClaimed(didName, overrides)];
                    case 1:
                        res = _a.sent();
                        if (!res) {
                            return [2 /*return*/, errors_1.Error.ErrDidNotClaimed];
                        }
                        return [4 /*yield*/, this.hashKeyDID.Did2TokenId(didName, overrides)];
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
     * @param {CallOverrides} [overrides] Note block number, eg: {"blockTag": 36513266}
     * @return {promise<string>} return metadata avatar url
     */
    Avatar.prototype.GetMetadataImageByTokenId = function (tokenId, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var totalSupply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashKeyDID.TotalSupply(overrides)];
                    case 1:
                        totalSupply = _a.sent();
                        if (tokenId > totalSupply) {
                            return [2 /*return*/, errors_1.Error.ErrTokenIdNotMinted];
                        }
                        return [2 /*return*/, this.GetMetadataImage(tokenId)];
                }
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
    Avatar.prototype.GetAvatarByDIDName = function (didName, overrides, chainRpc) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res, tokenId, avatarText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashKeyDID.DidClaimed(didName, overrides)];
                    case 1:
                        res = _a.sent();
                        if (!res) {
                            return [2 /*return*/, errors_1.Error.ErrDidNotClaimed];
                        }
                        return [4 /*yield*/, this.hashKeyDID.Did2TokenId(didName, overrides)];
                    case 2:
                        tokenId = _a.sent();
                        return [4 /*yield*/, this.resolver.Text(tokenId, "avatar", overrides)];
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
    Avatar.prototype.GetAvatarByTokenId = function (tokenId, overrides, chainRpc) {
        if (overrides === void 0) { overrides = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var totalSupply, avatarText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hashKeyDID.TotalSupply(overrides)];
                    case 1:
                        totalSupply = _a.sent();
                        if (tokenId > totalSupply) {
                            return [2 /*return*/, errors_1.Error.ErrTokenIdNotMinted];
                        }
                        return [4 /*yield*/, this.resolver.Text(tokenId, "avatar", overrides)];
                    case 2:
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
     * AvatarFormatText2AvatarUrl convert avatar format text in resolver to an image url
     *
     * @param {string} formatText eg: nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619
     * @param {string} [chainRpc] eg: "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
     * @return {promise<string>} return image url
     */
    Avatar.prototype.AvatarFormatText2AvatarUrl = function (formatText, chainRpc) {
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
    Avatar.prototype.GetImageFromTokenURI = function (tokenURI) {
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
    Avatar.prototype.GetMetadata = function (tokenId) {
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
    Avatar.prototype.GetMetadataImage = function (tokenId) {
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
    Avatar.prototype.GetMetadataName = function (tokenId) {
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
    Avatar.prototype.GetMetadataDescription = function (tokenId) {
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
    return Avatar;
}());
exports.Avatar = Avatar;
//# sourceMappingURL=avatar.js.map