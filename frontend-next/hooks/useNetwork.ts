import React from "react";
import { useState } from "react";
import { ethereum, networkVersion } from "../utils/ethereum";

const useNetwork = () => {
  const [network, setNetwork] = useState<null | number>(null);
  let netRef = null;

  if (typeof window !== "undefined") {
    netRef = networkVersion();
  }

  React.useEffect(() => {
    const net = networkVersion();
    setNetwork(net);
  }, [netRef]);

  React.useEffect(() => {
    const eth = ethereum();
    if (eth) {
      eth.on("chainChanged", (_chainId: number) => setNetwork(_chainId));
    }
  }, []);

  return network;
};

export default useNetwork;
