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
var did_1 = require("./did");
describe("hashkeyDID test", function () { return __awaiter(void 0, void 0, void 0, function () {
    var did, didName, tokenId, authorizedAddr;
    return __generator(this, function (_a) {
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                did = new did_1.HashKeyDID({ privateKey: "f3db6526e98e79c7bd1dcadfa15a01e1de5c7293669608f90b92305812222222" });
                tokenId = 13756;
                didName = "herro.key";
                authorizedAddr = "0xa060C1C3807059027Ca141EFb63f19E12e0cBF0c";
                return [2 /*return*/];
            });
        }); });
        it("Get addr by DID name", function () { return __awaiter(void 0, void 0, void 0, function () {
            var addr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.GetAddrByDIDName(didName)];
                    case 1:
                        addr = _a.sent();
                        (0, chai_1.expect)(addr).equal("0xB45c5Eac26AF321dd9C02693418976F52E1219b6");
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Verify did format", function () { return __awaiter(void 0, void 0, void 0, function () {
            var did1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        did1 = "xxx.key1";
                        return [4 /*yield*/, did.VerifyDIDFormat(did1)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).false;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(100000);
        it("Get did authorized addresses", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.GetAuthorizedAddrs(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result[0]).equal(authorizedAddr);
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Check did authorized address", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.IsAddrAuthorized(tokenId, authorizedAddr)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).true;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get KYC information", function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, KYCProvider, KYCId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = 5945;
                        KYCProvider = "0x0FC1021d0B7111f2170d1183367AAcaC26c68888";
                        KYCId = 2;
                        return [4 /*yield*/, did.GetKYCInfo(token, KYCProvider, KYCId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result[0]).true;
                        (0, chai_1.expect)(result[1].toNumber()).equal(1642193640);
                        (0, chai_1.expect)(result[2].toNumber()).equal(1705265640);
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Check if did has already claimed", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.DidClaimed(didName)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).true;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Check if address has already claimed", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.AddrClaimed(authorizedAddr)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).true;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get tokenId by did", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.TokenId2Did(tokenId)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal(didName);
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it("Get did by tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, did.Did2TokenId(didName)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).equal(tokenId);
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=did_test.js.map