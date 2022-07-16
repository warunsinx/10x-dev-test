import React from "react";
import AccountCard from "./AccountCard";
import useWalletStore from "../stores/WalletStore";
import { ModuleType } from "../types/module.type";

export default function AccountList({
  setSelected,
}: {
  setSelected: (module: ModuleType, account: string) => void;
}) {
  const bankAccounts = useWalletStore((state) => state.bankAccounts);

  return (
    <div className="space-y-5 mt-5">
      {bankAccounts.map((account, i) => (
        <AccountCard
          key={i}
          name={account.name}
          balance={account.balance}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}
