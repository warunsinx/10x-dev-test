import React, { useState } from "react";
import { ModuleType } from "../types/module.type";
import Navbar from "./Navbar";
import CreateAccountHolder from "./CreateAccountHolder";
import CreateAccountModule from "./CreateAccountModule";
import DepositModule from "./DepositModule";
import TransferModule from "./TransferModule";
import WithdrawModule from "./WithdrawModule";
import AccountList from "./AccountList";
import BackButton from "./BackButton";
import useWalletStore from "../stores/WalletStore";
import Spinner from "./Spinner";

export default function MainView() {
  const wallet = useWalletStore((state) => state.address);
  const walletDataLoading = useWalletStore((state) => state.walletDataLoading);
  const [selectedModule, setSelectedModule] = useState<ModuleType>("idle");
  const [targetAccount, setTargetAccount] = useState("");

  const renderTitle = () => {
    switch (selectedModule) {
      case "idle":
        return "My Accounts:";
      case "create":
        return "Create your bank account:";
      case "deposit":
        return "Deposit:";
      case "withdraw":
        return "Withdraw:";
      case "transfer":
        return "Transfer:";
      default:
        return "My Accounts:";
    }
  };

  const renderModule = () => {
    switch (selectedModule) {
      case "create":
        return <CreateAccountModule setModule={setSelectedModule} />;
      case "deposit":
        return <DepositModule setModule={setSelectedModule} />;
      case "withdraw":
        return <WithdrawModule setModule={setSelectedModule} />;
      case "transfer":
        return <TransferModule setModule={setSelectedModule} />;
      default:
        return wallet ? (
          <>
            {walletDataLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <>
                <AccountList />
                <CreateAccountHolder setModule={setSelectedModule} />
              </>
            )}
          </>
        ) : (
          <></>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-12">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="flex items-center mt-5 ml-5 font-medium text-xl">
            {selectedModule !== "idle" && (
              <BackButton backHandler={() => setSelectedModule("idle")} />
            )}
            <p>{renderTitle()}</p>
          </div>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
