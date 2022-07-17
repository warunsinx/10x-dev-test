import { ethers } from "hardhat";
import { DaiToken__factory, TenXBank__factory } from "../../typechain-types";

export const deployTestDaiToken = async () => {
  const DaiToken = (await ethers.getContractFactory(
    "DaiToken"
  )) as DaiToken__factory;
  const totalSupply = ethers.utils.parseEther("6900000000");
  return DaiToken.deploy(totalSupply);
};

export const deployTestTenXBank = async (bankToken: string) => {
  const TenXBank = (await ethers.getContractFactory(
    "TenXBank"
  )) as TenXBank__factory;
  return TenXBank.deploy(bankToken);
};
