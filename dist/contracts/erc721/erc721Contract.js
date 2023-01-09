"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC721Contract = void 0;
var ethers_1 = require("ethers");
var erc721Abi_1 = require("./erc721Abi");
function ERC721Contract(rpc, address) {
    var provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
    return new ethers_1.ethers.Contract(address, erc721Abi_1.erc721Abi, provider);
}
exports.ERC721Contract = ERC721Contract;
//# sourceMappingURL=erc721Contract.js.map