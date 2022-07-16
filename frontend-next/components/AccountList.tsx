import React from "react";
import AccountCard from "./AccountCard";
import useWalletStore from "../stores/WalletStore";

export default function AccountList() {
  const bankAccounts = useWalletStore((state) => state.bankAccounts);

  return (
    <div>
      {bankAccounts.map((account, i) => (
        <AccountCard key={i} name={account.name} balance={account.balance} />
      ))}
    </div>
  );
}
