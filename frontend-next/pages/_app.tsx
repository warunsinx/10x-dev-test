import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import useWalletStore from "../stores/WalletStore";

function MyApp({ Component, pageProps }: AppProps) {
  const loadSession = useWalletStore((state) => state.loadSession);
  const walletAddress = useWalletStore((state) => state.address);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      loadWalletData();
    }
  }, [walletAddress]);

  return <Component {...pageProps} />;
}

export default MyApp;
