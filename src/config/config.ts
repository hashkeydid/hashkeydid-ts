// config
export const DefaultPlatONUrl = "https://openapi2.platon.network/rpc";
export const DefaultDIDContractAddr = "0x7fDd3f96cBDE51737A9E24b461E7E92A057C3BBf";
export const DefaultDIDResolverContractAddr = "0x606729294604A1c71f4BFc001894E4f8095Ec2eF";
export const Address0 = "0x0000000000000000000000000000000000000000"

export const ChainRPCMap = new Map<string, string>([
    ["1", "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"],// Ethereum
    ["137", "https://matic-mainnet-archive-rpc.bwarelabs.com"],// Polygon
    ["8217", "https://klaytn01.fandom.finance"],// Klaytn
    ["210425", "https://openapi2.platon.network/rpc"] // PlatON
])
