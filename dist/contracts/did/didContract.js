"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDContract = exports.provider = void 0;
var ethers_1 = require("ethers");
var didAbi_1 = require("./didAbi");
var setting = require("../../config/config");
exports.provider = new ethers_1.ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
// contract for query
exports.DIDContract = new ethers_1.ethers.Contract(setting.DefaultDIDContractAddr, didAbi_1.DIDAbi, exports.provider);
//# sourceMappingURL=didContract.js.map