import React from "react";
import CustomButton from "./CustomButton";
import { ModuleType } from "../types/module.type";

export default function AccountCard({
  name,
  balance,
  setSelected,
}: {
  name: string;
  balance: number;
  setSelected: (module: ModuleType, account: string) => void;
}) {
  return (
    <div className="border-2 border-b-0 border-indigo-500 rounded-t-xl">
      <div className="p-5 py-7 text-lg font-medium text-white">
        <p className="mr-3">
          Account Name: <span className="ml-[39px]">{name}</span>
        </p>
        <p className="mr-3">
          Balance:{" "}
          <span className="ml-[95px]">
            {balance.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </span>{" "}
          DAI
        </p>
      </div>
      <div className="flex">
        <CustomButton
          text="Deposit"
          onClick={() => setSelected("deposit", name)}
        />
        <CustomButton
          text="Withdraw"
          onClick={() => setSelected("withdraw", name)}
        />
        <CustomButton
          text="Transfer"
          onClick={() => setSelected("transfer", name)}
        />
      </div>
    </div>
  );
}
