import getProvider from "../utils/getProvider";
import { ERC20__factory, TenXBank__factory } from "../typechain-types";

export const erc20Contract = (address: string, provider = getProvider()) =>
  ERC20__factory.connect(address, provider);

export const tenXBankContract = (address: string, provider = getProvider()) =>
  TenXBank__factory.connect(address, provider);
