import React from "react";
import CustomButton from "./CustomButton";

export default function AccountCard({
  name,
  balance,
}: {
  name: string;
  balance: number;
}) {
  return (
    <div className="border-2 border-indigo-500 mt-5">
      <div className="p-5">
        <p className="mr-3">Account Name: {name}</p>
        <p className="mr-3">Account Balance: {balance}</p>
      </div>
      <div className="flex">
        <CustomButton text="Deposit" />
        <CustomButton text="Withdraw" />
        <CustomButton text="Transfer" />
      </div>
    </div>
  );
}
