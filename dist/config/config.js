"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainList = exports.ChainRPCMap = exports.Address0 = void 0;
// config
// export const DefaultPlatONUrl = "https://openapi2.platon.network/rpc";
// export const DefaultDIDContractAddr = "0x7fDd3f96cBDE51737A9E24b461E7E92A057C3BBf";
// export const DefaultDIDResolverContractAddr = "0x606729294604A1c71f4BFc001894E4f8095Ec2eF";
exports.Address0 = "0x0000000000000000000000000000000000000000";
exports.ChainRPCMap = new Map([
    ["1", "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"],
    ["137", "https://matic-mainnet-archive-rpc.bwarelabs.com"],
    ["1284", "https://moonbeam.public.blastapi.io"],
    ["8217", "https://klaytn01.fandom.finance"],
    ["210425", "https://openapi2.platon.network/rpc"] // PlatON
]);
exports.ChainList = new Map([
    ["1", {
            ChainName: "Ethereum",
            ChainId: 1,
            DIDContract: "0x7fdd3f96cbde51737a9e24b461e7e92a057c3bbf",
            ResolveContract: "0x2d64eb6bb9087a34281431eb0ff66a34ff7fa319"
        }],
    ["137", {
            ChainName: "Polygon",
            ChainId: 137,
            DIDContract: "0x7fdd3f96cbde51737a9e24b461e7e92a057c3bbf",
            ResolveContract: "0x2d64eb6bb9087a34281431eb0ff66a34ff7fa319"
        }],
    // ["8217", "https://klaytn01.fandom.finance"],// Klaytn
    ["210425", {
            ChainName: "PlatON",
            ChainId: 210425,
            DIDContract: "0x7fDd3f96cBDE51737A9E24b461E7E92A057C3BBf",
            ResolveContract: "0x606729294604A1c71f4BFc001894E4f8095Ec2eF"
        }] // PlatON
]);
//# sourceMappingURL=config.js.map