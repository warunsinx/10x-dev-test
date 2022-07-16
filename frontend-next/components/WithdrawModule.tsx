import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";

export default function WithdrawModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  const [amount, setAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const bankAccounts = useWalletStore((state) => state.bankAccounts);
  const accountBalance = bankAccounts.find((acc) => acc.name === account)
    ?.balance as number;

  const withdrawHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setWithdrawLoading(true);

    try {
      await bankService.withdraw(account, amount).then((tx) => tx.wait());
      await loadWalletData();
      setAmount("");
      setModule("idle");
    } catch (err) {
      console.log(err);
    }

    setWithdrawLoading(false);
  };

  return (
    <form
      onSubmit={withdrawHandler}
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
        <p className="mr-3">Account Balance:</p>
        <input
          disabled
          value={accountBalance}
          type="text"
          name="balance"
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
      {accountBalance < +amount || accountBalance === 0 ? (
        <CustomButton
          type="submit"
          text="Insufficient DAI in Account"
          disabled={true}
        />
      ) : (
        <CustomButton
          type="submit"
          text="Withdraw"
          isLoading={withdrawLoading}
          disabled={withdrawLoading}
        />
      )}
    </form>
  );
}
