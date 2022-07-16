import addressUtils from "../../utils/addressUtils";
import hre, { ethers } from "hardhat";
import { Multicall__factory } from "../../typechain-types";

export async function deployMulticall() {
  const Multicall = (await ethers.getContractFactory(
    "Multicall"
  )) as Multicall__factory;

  const multicall = await Multicall.deploy();

  await multicall.deployed();

  console.log("Deployed Multicall to: ", multicall.address);

  await addressUtils.saveAddresses(hre.network.name, {
    Multicall: multicall.address,
  });
}
