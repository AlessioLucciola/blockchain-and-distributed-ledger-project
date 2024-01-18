import { ethers } from "hardhat";

async function deployContract(contractName: string) {
    const [deployer] = await ethers.getSigners();

    console.log(`Deploying ${contractName} with deployer address: ${deployer.address}`);
    
    const contract = await ethers.deployContract(contractName);
    await contract.waitForDeployment();

    if (contractName === "SmartSupply") {
        console.log(`---> ${contractName} deployed to: `, contract.target, ` <---`);
    } else {
        console.log(`${contractName} deployed to:`, contract.target);
    }
    return contract;
}

async function main() {
    const BalanceManager = await deployContract("BalanceManager");
    const Entities = await deployContract("Entities");
    const SmartSupply = await deployContract("SmartSupply");
    const Utils = await deployContract("Utils");

    console.log("Deployment of all contracts completed!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
