import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";
import { toast } from "react-toastify";

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
      if (accounts.length === 1) {
        await bankService
          .transfer(account, accounts[0].name, accounts[0].amount)
          .then((tx) => tx.wait());
      } else {
        await bankService
          .transferBatch(
            account,
            accounts.map((acc) => acc.name),
            accounts.map((acc) => acc.amount)
          )
          .then((tx) => tx.wait());
      }
      toast.success("Transfer Successfully !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await loadWalletData();
      setAccounts([{ name: "", amount: "", fee: 0 }]);
      setModule("idle");
    } catch (err) {
      toast.error("Something went wrong !");
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
      className="border-2 border-indigo-500 p-5 mt-5 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row mb-3 items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 border-b-2 pb-3 border-yellow-500">
        <div className="flex items-center flex-1">
          <p className="mr-3">Account Name:</p>
          <input
            disabled
            value={account}
            type="text"
            name="name"
            className="border-2 border-indigo-500 flex-1 py-2 px-2 bg-gray-800 text-gray-400 rounded-lg"
          />
        </div>
        <div className="flex items-center flex-1">
          <p className="mr-3">Account Balance:</p>
          <input
            disabled
            value={accountBalance}
            type="text"
            name="balance"
            className="border-2 border-indigo-500 flex-1 py-2 px-2 bg-gray-800 text-gray-400 rounded-lg"
          />
        </div>
      </div>

      {accounts.map((acc, i) => (
        <div key={i} className="mb-5 mt-3 border-b-2 pb-3 border-yellow-500">
          <div className="flex flex-col sm:flex-row mb-3 items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 border-b-2 pb-3 border-yellow-500">
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
                className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-indigo-700 focus:outline-none bg-gray-800 text-white rounded-lg"
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
                className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-indigo-700 focus:outline-none bg-gray-800 text-white rounded-lg"
              />
            </div>
            <div className="w-full sm:w-12">
              <CustomButton
                rounded="rounded-xl"
                disabled={accounts.length === 1}
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
          <div className="w-full flex justify-end">
            <p>
              Fee {acc.name.length ? acc.fee : 0}% | Receive ={" "}
              {+acc.amount * (1 - acc.fee / 100) || 0} DAI
            </p>
          </div>
        </div>
      ))}
      <div className="mb-3">
        <CustomButton
          rounded="rounded-xl"
          text="Add Receiver"
          onClick={() =>
            setAccounts([...accounts, { name: "", amount: "", fee: 0 }])
          }
        />
      </div>
      {accountBalance <
        accounts.reduce((prev, curr) => prev + +curr.amount, 0) ||
      accountBalance === 0 ? (
        <CustomButton
          rounded="rounded-xl"
          type="submit"
          text="Insufficient DAI in Account"
          disabled={true}
        />
      ) : (
        <CustomButton
          rounded="rounded-xl"
          type="submit"
          text="Transfer"
          isLoading={transferLoading}
          disabled={transferLoading}
        />
      )}
    </form>
  );
}
