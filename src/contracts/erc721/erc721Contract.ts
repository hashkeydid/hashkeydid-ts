import {ethers} from "ethers";
import {erc721Abi} from "./erc721Abi"

export function ERC721Contract(rpc: string, address: string): ethers.Contract {
    let provider = new ethers.providers.JsonRpcProvider(rpc);
    return new ethers.Contract(address, erc721Abi, provider);
}
