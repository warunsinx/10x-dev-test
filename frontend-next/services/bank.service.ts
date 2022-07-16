import { getSigner } from "../utils/getProvider";
import { ADDRESS_LIST } from "../constants/addressList";
import { tenXBankContract } from "../contracts/index";
import { ContractCallContext } from "ethereum-multicall";
import { getMulticall as multicall } from "../utils/getMulticall";
import { TenXBank__factory } from "../typechain-types";
import { formatEther } from "ethers/lib/utils";

const bankContract = tenXBankContract(ADDRESS_LIST["TenXBank"]);

const createAccount = async (name: string) => {
  const signer = getSigner();
  return bankContract.connect(signer).createAccount(name);
};

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

const bankService = {
  createAccount,
  getAccounts,
};

export default bankService;
