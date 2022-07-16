import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";
import TransferBatchModule from "./TransferBatchModule";

export default function TransferModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [fee, setFee] = useState(0);

  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const bankAccounts = useWalletStore((state) => state.bankAccounts);
  const accountBalance = bankAccounts.find((acc) => acc.name === account)
    ?.balance as number;

  const transferHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setTransferLoading(true);

    try {
      await bankService.transfer(account, to, amount).then((tx) => tx.wait());
      await loadWalletData();
      setAmount("");
      setModule("idle");
    } catch (err) {
      console.log(err);
    }

    setTransferLoading(false);
  };

  const checkFee = (name: string) => {
    const isOwn = bankAccounts.find((acc) => acc.name === name);
    isOwn ? setFee(0) : setFee(1);
  };

  return (
    <div>
      <form
        onSubmit={transferHandler}
        className="border-2 border-indigo-500 mt-5 p-5"
      >
        <div className="flex items-center mb-3">
          <p className="mr-3">From Account Name:</p>
          <input
            disabled
            value={account}
            type="text"
            name="from"
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
          <p className="mr-3">To Account Name:</p>
          <input
            autoFocus
            required
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              checkFee(e.target.value);
            }}
            type="text"
            name="to"
            className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-yellow-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center mb-3">
          <p className="mr-3">Amount:</p>
          <input
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
          <div className="flex items-center">
            <p className="w-full">
              Fee {to.length ? fee : 0}% | Receive ={" "}
              {+amount * (1 - fee / 100) || 0} DAI
            </p>
            <CustomButton
              type="submit"
              text="Transfer"
              isLoading={transferLoading}
              disabled={transferLoading}
            />
          </div>
        )}
      </form>
      <TransferBatchModule setModule={setModule} account={account} />
    </div>
  );
}
