import { ethereum } from "./ethereum";
import Router from "next/router";

export const switchNetwork = async (
  chainId: string,
  chainName: string,
  nativeCurrency: { name: string; symbol: string; decimals: number },
  rpcUrls: string[],
  blockExplorerUrls: string[]
) => {
  try {
    const eth = ethereum();
    if (eth) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName,
            nativeCurrency,
            rpcUrls,
            blockExplorerUrls,
          },
        ],
      });
      Router.reload();
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};
