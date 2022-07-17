import React from "react";
import { ColorSwatchIcon } from "@heroicons/react/outline";
import useWalletStore from "../stores/WalletStore";

export default function ConnectWalletHolder() {
  const connectMetamask = useWalletStore((state) => state.connectMetamask);

  return (
    <div
      onClick={() => connectMetamask()}
      className="w-full border-2 border-indigo-500 border-dashed p-20 mt-5 rounded-lg flex justify-center items-center hover:bg-indigo-900 bg-opacity-5 cursor-pointer"
    >
      <div className="flex items-center justify-center w-full space-x-1.5">
        <ColorSwatchIcon className="text-yellow-500" height={25} />
        <p className="text-xl font-bold text-white">
          Connect a wallet to get started !
        </p>
      </div>
    </div>
  );
}
