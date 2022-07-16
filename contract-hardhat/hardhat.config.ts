import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const getAccounts = () => {
  const arr = Object.entries(process.env);
  const privateKeys = arr
    .filter(([key, val]) => key.includes(`PRIVATE_KEY`))
    .map(([key, val]) => val || "");
  return privateKeys;
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    bsc_test: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: getAccounts(),
    },
  },
};

export default config;
