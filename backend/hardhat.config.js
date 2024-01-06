"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const config = {
    solidity: "0.8.8",
    settings: {
        optimizer: {
          enabled: true,
          runs: 200,
          details: { yul: false },
        },
    },
    networks: {
        localhost: {
            url: "http:127.0.0.1:8545",
            allowUnlimitedContractSize: true,
        }
    },
};
exports.default = config;
