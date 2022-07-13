import * as ethers from "ethers";
import { ethereum } from "./ethereum";

const getProvider = () => {
  const url = `https://data-seed-prebsc-1-s1.binance.org:8545/`;
  return new ethers.providers.JsonRpcProvider(url);
};

export const getSigner = () => {
  const eth = ethereum();
  const provider = new ethers.providers.Web3Provider(eth);
  return provider.getSigner();
};

export default getProvider;
