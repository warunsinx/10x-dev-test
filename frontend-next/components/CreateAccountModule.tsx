import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import CustomButton from "./CustomButton";
import bankService from "../services/bank.service";

export default function CreateAccountModule({
  setModule,
}: {
  setModule: (module: ModuleType) => void;
}) {
  const [name, setName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const createAccountHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      await bankService.createAccount(name).then((tx) => tx.wait());
      setName("");
      setModule("idle");
    } catch (err) {
      console.log(err);
    }

    setCreateLoading(false);
  };

  return (
    <form
      onSubmit={createAccountHandler}
      className="border-2 border-indigo-500 mt-5 p-5"
    >
      <div className="flex items-center mb-3">
        <p className="mr-3">Account Name:</p>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          className="border-2 border-indigo-500 flex-1 py-2 px-2"
        />
      </div>
      <CustomButton
        type="submit"
        text="Create"
        isLoading={createLoading}
        disabled={createLoading}
      />
    </form>
  );
}
