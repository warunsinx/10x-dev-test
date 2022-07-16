import { getSigner } from "../utils/getProvider";
import { ADDRESS_LIST } from "../constants/addressList";
import { tenXBankContract } from "../contracts/index";
import { ContractCallContext } from "ethereum-multicall";
import { getMulticall as multicall } from "../utils/getMulticall";
import { TenXBank__factory } from "../typechain-types";
import { formatEther, parseEther } from "ethers/lib/utils";

const bankContract = tenXBankContract(ADDRESS_LIST["TenXBank"]);

const getAccounts = async (walletAddress: string) => {
  const accounts = await bankContract.getOwnerAccounts(walletAddress);
  const contractCallContext: ContractCallContext[] = accounts.map(
    (account) => ({
      reference: account,
      contractAddress: ADDRESS_LIST["TenXBank"],
      abi: TenXBank__factory.abi,
      calls: [
        {
          reference: account,
          methodName: "accounts",
          methodParameters: [account],
        },
      ],
    })
  );
  const response = await multicall.call(contractCallContext);
  return Object.entries(response.results).map(([name, data]) => {
    return {
      name,
      balance: +formatEther(data.callsReturnContext[0].returnValues[2]),
    };
  }) as { name: string; balance: number }[];
};

const createAccount = async (name: string) => {
  const signer = getSigner();
  return bankContract.connect(signer).createAccount(name);
};

const deposit = async (name: string, amount: string) => {
  const signer = getSigner();
  return bankContract.connect(signer).deposit(name, parseEther(amount));
};

const withdraw = async (name: string, amount: string) => {
  const signer = getSigner();
  return bankContract.connect(signer).withdraw(name, parseEther(amount));
};

const transfer = async (from: string, to: string, amount: string) => {
  const signer = getSigner();
  return bankContract.connect(signer).transfer(from, to, parseEther(amount));
};

const transferBatch = async (
  from: string,
  receivers: string[],
  amounts: string[]
) => {
  const signer = getSigner();
  const parseAmounts = amounts.map((amount) => parseEther(amount));
  return bankContract
    .connect(signer)
    .transferBatch(from, receivers, parseAmounts);
};

const bankService = {
  getAccounts,
  createAccount,
  deposit,
  withdraw,
  transfer,
  transferBatch,
};

export default bankService;
