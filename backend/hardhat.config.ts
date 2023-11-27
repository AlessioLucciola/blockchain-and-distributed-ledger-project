import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http:127.0.0.1:7545",
    }
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true
  }
};

export default config;
