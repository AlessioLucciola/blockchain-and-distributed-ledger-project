import { ethers } from "hardhat";

async function main() {
  const BalanceManager = await ethers.deployContract("BalanceManager");
  await BalanceManager.waitForDeployment();
  
  const Entities = await ethers.deployContract("Entities");
  await Entities.waitForDeployment();

  const SmartSupply = await ethers.deployContract("SmartSupply");
  await SmartSupply.waitForDeployment();

  const Utils = await ethers.deployContract("Utils");
  await Utils.waitForDeployment();

  console.log("SmartSupply deployed to:", SmartSupply.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
