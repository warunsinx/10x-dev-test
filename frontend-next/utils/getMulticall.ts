import { Multicall } from "ethereum-multicall";
import getProvider from "./getProvider";
import { ADDRESS_LIST } from "../constants/addressList";

export const getMulticall = new Multicall({
  ethersProvider: getProvider(),
  multicallCustomContractAddress: ADDRESS_LIST["Multicall"],
});
