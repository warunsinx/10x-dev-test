import { ethers } from "ethers";
import { getSigner } from "../utils/getProvider";
import { ADDRESS_LIST } from "../constants/addressList";
import { erc20Contract } from "../contracts/index";

const getBalance = async (token: string, address: string) => {
  const tokenAddr = ADDRESS_LIST[token];
  if (tokenAddr) {
    const tokenContract = erc20Contract(tokenAddr);
    try {
      const [bal, dec] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.decimals(),
      ]);
      return ethers.utils.formatUnits(bal, dec);
    } catch (e) {
      return "0";
    }
  } else {
    return "0";
  }
};

const getAllowance = async (token: string, owner: string, spender: string) => {
  const tokenAddr = ADDRESS_LIST[token];
  if (tokenAddr) {
    const tokenContract = erc20Contract(tokenAddr);
    return tokenContract.allowance(owner, spender);
  } else {
    return 0;
  }
};

const approve = async (
  token: string,
  spender: string = ADDRESS_LIST["TenXBank"]
) => {
  const tokenAddr = ADDRESS_LIST[token];
  const signer = getSigner();

  if (tokenAddr && signer) {
    const tokenContract = erc20Contract(tokenAddr);
    return tokenContract
      .connect(signer)
      .approve(spender, ethers.constants.MaxUint256);
  } else {
    return null;
  }
};

const tokenService = {
  getBalance,
  getAllowance,
  approve,
};

export default tokenService;
