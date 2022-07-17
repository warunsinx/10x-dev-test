import React from "react";
import CustomButton from "./CustomButton";
import useWalletStore from "../stores/WalletStore";
import { truncateAddress } from "../utils/truncateAddress";
import Spinner from "./Spinner";

export default function Navbar() {
  const wallet = useWalletStore((state) => state.address);
  const balance = useWalletStore((state) => state.walletBalances);
  const connectMetamask = useWalletStore((state) => state.connectMetamask);

  const renderButton = () => {
    if (wallet) {
      return (
        <div className="items-center flex">
          {balance["DAI"] ? (
            <p className="bg-indigo-400 py-[6px] text-xl hidden sm:block px-3 rounded-l-lg">
              {(+balance["DAI"]).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
              <span className="ml-1 font-medium">DAI</span>
            </p>
          ) : (
            <p className="bg-indigo-400 py-[6px] text-xl hidden sm:flex px-3 rounded-l-lg justify-center items-center">
              <Spinner />
            </p>
          )}
          <CustomButton
            rounded="rounded-lg sm:rounded-r-lg sm:rounded-l-none"
            text={truncateAddress(wallet)}
            height="h-10"
            cursor="cursor-default"
          />
        </div>
      );
    } else
      return (
        <CustomButton
          rounded="rounded-lg"
          text="Connect Wallet"
          height="h-10"
          onClick={connectMetamask}
        />
      );
  };

  return (
    <div className="w-full h-20 px-5 sm:px-20 flex items-center justify-between text-white">
      <p className="font-bold text-2xl border-b-2 border-indigo-600 select-none">
        🚀 10xBank
      </p>
      <div className="">{renderButton()}</div>
    </div>
  );
}
