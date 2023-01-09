"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDResolverContract = void 0;
var ethers_1 = require("ethers");
var resolverAbi_1 = require("./resolverAbi");
var setting = require("../../config/config");
var provider = new ethers_1.ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
// contract for query
exports.DIDResolverContract = new ethers_1.ethers.Contract(setting.DefaultDIDResolverContractAddr, resolverAbi_1.ResolverAbi, provider);
//# sourceMappingURL=resolverContract.js.map