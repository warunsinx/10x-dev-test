import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";
import tokenService from "../services/token.service";

export default function DepositModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  const [amount, setAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const walletAllowances = useWalletStore((state) => state.walletAllowances);
  const walletBalance = useWalletStore((state) => state.walletBalances);
  const loadAllowances = useWalletStore((state) => state.loadWalletAllowances);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);

  const approveHandler = async () => {
    setApproveLoading(true);
    try {
      await tokenService.approve("DAI").then((tx) => tx?.wait());
      await loadAllowances();
    } catch (err) {
      console.log(err);
    }
    setApproveLoading(false);
  };

  const depositHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDepositLoading(true);

    try {
      await bankService.deposit(account, amount).then((tx) => tx.wait());
      await loadWalletData();
      setAmount("");
      setModule("idle");
    } catch (err) {
      console.log(err);
    }

    setDepositLoading(false);
  };

  return (
    <form
      onSubmit={depositHandler}
      className="border-2 border-indigo-500 mt-5 p-5"
    >
      <div className="flex items-center mb-3">
        <p className="mr-3">Account Name:</p>
        <input
          disabled
          value={account}
          type="text"
          name="name"
          className="border-2 border-indigo-500 flex-1 py-2 px-2 bg-gray-200"
        />
      </div>
      <div className="flex items-center mb-3">
        <p className="mr-3">Amount:</p>
        <input
          autoFocus
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          name="amount"
          className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-yellow-500 focus:outline-none"
        />
      </div>
      {+walletBalance["DAI"] < +amount || +walletBalance["DAI"] === 0 ? (
        <CustomButton
          type="submit"
          text="Insufficient DAI in Wallet"
          disabled={true}
        />
      ) : +walletAllowances["DAI"] < +amount ||
        +walletAllowances["DAI"] === 0 ? (
        <CustomButton
          onClick={approveHandler}
          type="button"
          text="Approve DAI"
          isLoading={approveLoading}
          disabled={approveLoading}
        />
      ) : (
        <CustomButton
          type="submit"
          text="Deposit"
          isLoading={depositLoading}
          disabled={depositLoading}
        />
      )}
    </form>
  );
}
