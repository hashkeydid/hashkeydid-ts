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
var errors_1 = require("../error/errors");
var did_1 = require("./did");
describe("DIDResolver test", function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, didName, tokenId, authorizedAddr, resolver;
    return __generator(this, function (_a) {
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, did_1.NewHashKeyDID)("https://openapi2.platon.network/rpc", { privateKey: "f3db6526e98e79c7bd1dcadfa15a01e1de5c7293669608f90b9230581047cbc4" })];
                    case 1:
                        resolver = _a.sent();
                        tokenId = 13756;
                        didName = "herro.key";
                        authorizedAddr = "0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c";
                        return [4 /*yield*/, resolver.WalletAddress()];
                    case 2:
                        address = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Get DID name when reverse is false", function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, resolver.GetDIDNameByAddr("0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        (0, chai_1.expect)(e_1.reason).equal(errors_1.Error.ErrAddrNotSetReverse);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get DID name force when reverse is false, and set block height", function () { return __awaiter(void 0, void 0, void 0, function () {
            var overrides, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        overrides = { "blockTag": 36513266 };
                        return [4 /*yield*/, resolver.GetDIDNameByAddrForce(address, overrides)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("herro.key");
                        overrides = { "blockTag": 36513264 };
                        return [4 /*yield*/, resolver.GetDIDNameByAddrForce(address, overrides)];
                    case 2:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("this addr has not claimed a did");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get blockchain address", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resolver.GetBlockChainAddress(tokenId, 1)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("0xb45c5eac26af321dd9c02693418976f52e1219b6");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get content value", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resolver.GetContentHash(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("0x1234");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        //
        it("Get public key", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resolver.GetPublicKey(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result[0]).equal("0x0000000000000000000000000000000000000000000000000000000000000003");
                        (0, chai_1.expect)(result[1]).equal("0x0000000000000000000000000000000000000000000000000000000000000004");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get value by key", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resolver.Text(tokenId, "name")];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal("咚咚咚");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=did_resolver_test.js.map