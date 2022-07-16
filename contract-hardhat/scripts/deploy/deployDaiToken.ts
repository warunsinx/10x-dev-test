import addressUtils from "../../utils/addressUtils";
import hre, { ethers } from "hardhat";
import { DaiToken__factory } from "../../typechain-types/factories/contracts/DaiToken__factory";

export async function deployDaiToken() {
  const DaiToken = (await ethers.getContractFactory(
    "DaiToken"
  )) as DaiToken__factory;

  const totalSupply = ethers.utils.parseEther("6900000000");

  const daiToken = await DaiToken.deploy(totalSupply);

  await daiToken.deployed();

  console.log("Deployed DAI to: ", daiToken.address);

  await addressUtils.saveAddresses(hre.network.name, {
    DAI: daiToken.address,
  });
}
