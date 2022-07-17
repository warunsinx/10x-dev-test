import React from "react";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import { switchNetwork } from "../utils/switchNetwork";

export default function SwitchNetworkHolder() {
  return (
    <div
      onClick={() =>
        switchNetwork(
          "0x61",
          "Smart Chain - Testnet",
          { name: "BNB", symbol: "BNB", decimals: 18 },
          ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          ["https://testnet.bscscan.com"]
        )
      }
      className="w-full border-2 border-indigo-500 border-dashed p-20 mt-5 rounded-lg flex justify-center items-center hover:bg-indigo-900 bg-opacity-5 cursor-pointer"
    >
      <div className="flex items-center justify-center w-full space-x-1.5">
        <SwitchHorizontalIcon className="text-yellow-500" height={25} />
        <p className="text-xl font-bold text-white">
          Switch network to BSC testnet !
        </p>
      </div>
    </div>
  );
}
