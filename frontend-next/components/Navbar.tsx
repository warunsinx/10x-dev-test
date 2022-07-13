import React from "react";
import CustomButton from "./CustomButton";
import useWalletStore from "../stores/WalletStore";
import { truncateAddress } from "../utils/truncateAddress";

export default function Navbar() {
  const wallet = useWalletStore((state) => state.address);
  const connectMetamask = useWalletStore((state) => state.connectMetamask);

  const renderButton = () => {
    if (wallet) {
      return (
        <CustomButton
          text={truncateAddress(wallet)}
          height="h-10"
          cursor="cursor-default"
        />
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
