import {ethers} from "ethers";
import {DIDAbi} from "./didAbi"
import * as setting from "../../config/config"

export const provider = new ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
// contract for query
export const DIDContract = new ethers.Contract(setting.DefaultDIDContractAddr, DIDAbi, provider);
