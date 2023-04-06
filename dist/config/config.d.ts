export declare const ChainRPCMap: Map<string, string>;
export interface ChainInfo {
    ChainName: string;
    ChainId: string | number;
    DIDContract: string;
    ResolveContract: string;
}
export declare const ChainList: Map<string, ChainInfo>;
