import { ethers } from "ethers";
import { ResolverAbi } from "./resolverAbi"
import * as setting from "../../config/config"

const provider = new ethers.providers.JsonRpcProvider(setting.DefaultPlatONUrl);
// contract for query
export const DIDResolverContract = new ethers.Contract(setting.DefaultDIDResolverContractAddr, ResolverAbi, provider);
