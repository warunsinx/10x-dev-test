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
import ConnectWalletHolder from "./ConnectWalletHolder";
import useNetwork from "../hooks/useNetwork";
import SwitchNetworkHolder from "./SwitchNetworkHolder";
import { ToastContainer } from "react-toastify";

export default function MainView() {
  const network = useNetwork();
  const wallet = useWalletStore((state) => state.address);
  const walletDataLoading = useWalletStore((state) => state.walletDataLoading);
  const [selectedModule, setSelectedModule] = useState<ModuleType>("idle");
  const [selectedAccount, setSelectedAccount] = useState("");

  const setSelected = (module: ModuleType, account: string) => {
    setSelectedModule(module);
    setSelectedAccount(account);
  };

  const renderTitle = () => {
    switch (selectedModule) {
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
        return (
          <DepositModule
            setModule={setSelectedModule}
            account={selectedAccount}
          />
        );
      case "withdraw":
        return (
          <WithdrawModule
            setModule={setSelectedModule}
            account={selectedAccount}
          />
        );
      case "transfer":
        return (
          <TransferModule
            setModule={setSelectedModule}
            account={selectedAccount}
          />
        );
      default:
        return (
          <>
            <AccountList setSelected={setSelected} />
            <CreateAccountHolder setModule={setSelectedModule} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 to-black pb-12 text-white">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-5xl px-8">
          {wallet && (
            <div className="flex items-center mt-5 ml-5 font-medium text-xl">
              {selectedModule !== "idle" && (
                <BackButton backHandler={() => setSelectedModule("idle")} />
              )}
              <p>{renderTitle()}</p>
            </div>
          )}
          {wallet ? (
            <>
              {walletDataLoading ? (
                <div className="w-full mt-10 flex justify-center items-center">
                  <Spinner />
                </div>
              ) : network !== 97 ? (
                <SwitchNetworkHolder />
              ) : (
                renderModule()
              )}
            </>
          ) : (
            <ConnectWalletHolder />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
