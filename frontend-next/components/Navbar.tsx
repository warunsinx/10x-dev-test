import React from "react";
import CustomButton from "./CustomButton";
import useWalletStore from "../stores/WalletStore";
import { truncateAddress } from "../utils/truncateAddress";

export default function Navbar() {
  const wallet = useWalletStore((state) => state.address);
  const balance = useWalletStore((state) => state.walletBalances);
  const connectMetamask = useWalletStore((state) => state.connectMetamask);

  const renderButton = () => {
    if (wallet) {
      return (
        <div className="flex items-center">
          {balance["DAI"] && (
            <p className="mr-3 text-xl">
              {(+balance["DAI"]).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
              <span className="ml-1 font-medium">DAI</span>
            </p>
          )}
          <CustomButton
            text={truncateAddress(wallet)}
            height="h-10"
            cursor="cursor-default"
          />
        </div>
      );
    } else
      return (
        <CustomButton
          text="Connect Wallet"
          height="h-10"
          onClick={connectMetamask}
        />
      );
  };

  return (
    <div className="w-full h-20 px-20 flex items-center justify-between">
      <p className="font-bold text-2xl border-b-2 border-indigo-600 select-none">
        🚀 10xBank
      </p>
      <div className="">{renderButton()}</div>
    </div>
  );
}
