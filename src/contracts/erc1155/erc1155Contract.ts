import {ethers} from "ethers";
import {erc1155Abi} from "./erc1155"

export function ERC1155Contract(rpc: string, address: string): ethers.Contract {
    let provider = new ethers.providers.JsonRpcProvider(rpc);
    return new ethers.Contract(address, erc1155Abi, provider);
}
