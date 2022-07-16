import addressUtils from "../../utils/addressUtils";
import hre, { ethers } from "hardhat";
import { TenXBank__factory } from "../../typechain-types";

export async function deployTenXBank() {
  const addressList = await addressUtils.getAddressList(hre.network.name);

  const TenXBank = (await ethers.getContractFactory(
    "TenXBank"
  )) as TenXBank__factory;

  const tenXBank = await TenXBank.deploy(addressList["DAI"]);

  await tenXBank.deployed();

  console.log("Deployed TenXBank to: ", tenXBank.address);

  await addressUtils.saveAddresses(hre.network.name, {
    TenXBank: tenXBank.address,
  });
}
