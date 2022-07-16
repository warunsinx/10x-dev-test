import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";

export default function TransferBatchModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  const [transferLoading, setTransferLoading] = useState(false);
  const [accounts, setAccounts] = useState([{ name: "", amount: "", fee: 0 }]);

  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const bankAccounts = useWalletStore((state) => state.bankAccounts);
  const accountBalance = bankAccounts.find((acc) => acc.name === account)
    ?.balance as number;

  const transferHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setTransferLoading(true);

    try {
      await bankService
        .transferBatch(
          account,
          accounts.map((acc) => acc.name),
          accounts.map((acc) => acc.amount)
        )
        .then((tx) => tx.wait());
      await loadWalletData();
      setAccounts([{ name: "", amount: "", fee: 0 }]);
      setModule("idle");
    } catch (err) {
      console.log(err);
    }

    setTransferLoading(false);
  };

  const checkFee = (name: string) => {
    const isOwn = bankAccounts.find((acc) => acc.name === name);
    return isOwn ? 0 : 1;
  };

  return (
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
      {accounts.map((acc, i) => (
        <div key={i} className="mb-5">
          <div key={i} className="flex items-center space-x-3 mb-1">
            <div className="flex-1 flex items-center">
              <p className="mr-3">To Account Name:</p>
              <input
                autoFocus
                required
                value={acc.name}
                onChange={(e) => {
                  setAccounts([
                    ...accounts.slice(0, i),
                    {
                      ...accounts[i],
                      name: e.target.value,
                      fee: checkFee(e.target.value),
                    },
                    ...accounts.slice(i + 1),
                  ]);
                }}
                type="text"
                name={`to-${i}`}
                className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-yellow-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center">
              <p className="mr-3">Amount:</p>
              <input
                required
                value={acc.amount}
                onChange={(e) => {
                  setAccounts([
                    ...accounts.slice(0, i),
                    { ...accounts[i], amount: e.target.value },
                    ...accounts.slice(i + 1),
                  ]);
                }}
                type="number"
                name={`amount-${i}`}
                className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-yellow-500 focus:outline-none"
              />
            </div>
            <div className="w-12">
              <CustomButton
                text="X"
                onClick={() => {
                  setAccounts([
                    ...accounts.slice(0, i),
                    ...accounts.slice(i + 1),
                  ]);
                }}
              />
            </div>
          </div>
          <p className="w-full">
            Fee {acc.name.length ? acc.fee : 0}% | Receive ={" "}
            {+acc.amount * (1 - acc.fee / 100) || 0} DAI
          </p>
        </div>
      ))}
      <div className="mb-3">
        <CustomButton
          text="Add Account"
          onClick={() =>
            setAccounts([...accounts, { name: "", amount: "", fee: 0 }])
          }
        />
      </div>
      {accountBalance <
        accounts.reduce((prev, curr) => prev + +curr.amount, 0) ||
      accountBalance === 0 ? (
        <CustomButton
          type="submit"
          text="Insufficient DAI in Account"
          disabled={true}
        />
      ) : (
        <CustomButton
          type="submit"
          text="Batch Transfer"
          isLoading={transferLoading}
          disabled={transferLoading}
        />
      )}
    </form>
  );
}
