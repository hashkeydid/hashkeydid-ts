"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC1155Contract = void 0;
var ethers_1 = require("ethers");
var erc1155_1 = require("./erc1155");
function ERC1155Contract(rpc, address) {
    var provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
    return new ethers_1.ethers.Contract(address, erc1155_1.erc1155Abi, provider);
}
exports.ERC1155Contract = ERC1155Contract;
//# sourceMappingURL=erc1155Contract.js.map