import create from "zustand";
import { ethereum } from "../utils/ethereum";
import tokenService from "../services/token.service";
import localService from "../services/local.service";
import STORAGE_KEYS from "../constants/storageKey";
import { ADDRESS_LIST } from "../constants/addressList";
import bankService from "../services/bank.service";
import { formatEther } from "ethers/lib/utils";

enum WalletType {
  Metamask = "metamask",
}

const store = (set: any, get: any) => ({
  address: "" as string,
  walletBalances: {} as Record<string, string>,
  walletAllowances: {} as Record<string, string>,
  bankAccounts: [] as { name: string; balance: number }[],
  sessionLoading: true,
  walletDataLoading: true,
  loadSession: async () => {
    const walletType = localService.getItem(STORAGE_KEYS.WALLET_TYPE);
    if (walletType) {
      switch (walletType) {
        case WalletType.Metamask:
          set({ sessionLoading: false });
          return get().connectMetamask() as Promise<string>;
        default:
          return null;
      }
    }
    set({ sessionLoading: false });
  },
  loadWalletData: async () => {
    const promises = [get().loadWalletBalances(), get().loadBankAccounts()];
    await Promise.all(promises);
    set({ walletDataLoading: false });
  },
  subscribeWalletChange: (callback?: (address: string) => void) => {
    const eth = ethereum();
    if (eth) {
      return eth.on("accountsChanged", (accounts: string) => {
        set({ walletDataLoading: true });
        const account = accounts[0];
        if (account) {
          callback && callback(account);
        } else {
          callback && callback("");
        }
      });
    }
  },
  connectMetamask: async () => {
    try {
      const eth = ethereum();
      if (eth) {
        const accounts = await eth.request({
          method: "eth_requestAccounts",
        });
        const account: string = accounts[0];
        if (account) {
          get().subscribeWalletChange((account: string) => {
            const walletType = get().walletType;
            if (walletType === WalletType.Metamask) {
              set({ address: account });
            }
          });
          localService.setItem(STORAGE_KEYS.WALLET_TYPE, WalletType.Metamask);
          set({ address: account, walletType: WalletType.Metamask });
          return account;
        }
      }
      set({ sessionLoading: false });
      return null;
    } catch (e: any) {
      set({ sessionLoading: false });
      console.error(e.response);
      return null;
    }
  },
  loadBankAccounts: async () => {
    const address = get().address;
    if (address) {
      const bankAccounts = await bankService.getAccounts(address);
      set({ bankAccounts });
    } else {
      set({ bankAccounts: [] });
    }
  },
  loadWalletBalances: async () => {
    const address = get().address;
    if (address) {
      const daiBalance = await tokenService.getBalance("DAI", address);
      set({ walletBalances: { DAI: daiBalance } });
    } else {
      set({ walletBalances: {} });
    }
  },
  loadWalletAllowances: async () => {
    const address = get().address;
    if (address) {
      const daiAllowance = await tokenService.getAllowance(
        "DAI",
        address,
        ADDRESS_LIST["TenXBank"]
      );
      set({ walletAllowances: { DAI: formatEther(daiAllowance) } });
    } else {
      set({ walletAllowances: {} });
    }
  },
});

type WalletStore = ReturnType<typeof store>;
const useWalletStore = create<WalletStore>(store);

export default useWalletStore;
