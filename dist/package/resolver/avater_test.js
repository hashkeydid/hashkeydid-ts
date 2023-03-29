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
var chai_1 = require("chai");
var resolver_1 = require("./resolver");
describe("DID avatar test", function () { return __awaiter(void 0, void 0, void 0, function () {
    var avatar, didName, tokenId, nft721, nft1155;
    return __generator(this, function (_a) {
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, resolver_1.NewHashKeyDIDResolver)("https://openapi2.platon.network/rpc")];
                    case 1:
                        avatar = _a.sent();
                        didName = "herro.key";
                        tokenId = 13756;
                        nft721 = "nft:1:721:0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91:8619";
                        nft1155 = "nft:1:1155:0xf4dd946d1406e215a87029db56c69e1bcf3e1773:1";
                        return [2 /*return*/];
                }
            });
        }); });
        it("Get DID metadata avatar by did", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err1, overrides, avatarUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadataImageByDIDName(didName, { blockTag: 36513265 })
                            .catch(function (err) {
                            err1 = err;
                        })];
                    case 1:
                        _a.sent();
                        (0, chai_1.expect)(err1).equal("this did name has not been claimed");
                        overrides = { blockTag: 36513266 };
                        return [4 /*yield*/, avatar.GetMetadataImageByDIDName(didName, overrides)];
                    case 2:
                        avatarUrl = _a.sent();
                        (0, chai_1.expect)(avatarUrl).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get DID metadata avatar by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var avatarUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadataImageByTokenId(tokenId)];
                    case 1:
                        avatarUrl = _a.sent();
                        (0, chai_1.expect)(avatarUrl).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get DID avatar by did", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetAvatarByDIDName(didName)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get DID avatar by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetAvatarByTokenId(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("https://arweave.net/qMWNCxhao7TGWnj8axed0YzLU1gx8-5yP1W1gBHNVFg");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get avatar by url", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.AvatarFormatText2AvatarUrl(nft721)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("https://nfts.renga.app/nfts/public/images/8619.jpeg");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get metadata by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadata(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result.description).equal("Your Passport in the Metaverse");
                        (0, chai_1.expect)(result.image).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
                        (0, chai_1.expect)(result.name).equal("herro.key");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get metadata image by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadataImage(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("https://api.hashkey.id/did/api/file/avatar_3619b3aa-7979-4d10-a1ea-e6725ab8096e.png");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get metadata name by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadataName(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("herro.key");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get metadata description by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avatar.GetMetadataDescription(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("Your Passport in the Metaverse");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=avater_test.js.map