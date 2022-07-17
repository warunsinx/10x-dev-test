import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";
import useWalletStore from "../stores/WalletStore";
import { toast } from "react-toastify";

export default function CreateAccountModule({
  setModule,
}: {
  setModule: (module: ModuleType) => void;
}) {
  const [name, setName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const loadBankAccounts = useWalletStore((state) => state.loadBankAccounts);

  const createAccountHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      await bankService.createAccount(name).then((tx) => tx.wait());
      toast.success("Account Created Successfully !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await loadBankAccounts();
      setName("");
      setModule("idle");
    } catch (err) {
      toast.error("Something went wrong !");
    }

    setCreateLoading(false);
  };

  return (
    <form
      onSubmit={createAccountHandler}
      className="border-2 border-indigo-500 mt-5 p-5 rounded-xl"
    >
      <div className="flex items-center mb-3 border-b-2 pb-3 border-yellow-500">
        <p className="mr-3">Account Name:</p>
        <input
          autoFocus
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          className="border-2 border-indigo-500 flex-1 py-2 px-2  focus:ring-2 ring-indigo-700 focus:outline-none bg-gray-800 text-white rounded-lg"
        />
      </div>
      <CustomButton
        rounded="rounded-lg"
        type="submit"
        text="Create"
        isLoading={createLoading}
        disabled={createLoading}
      />
    </form>
  );
}
