"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const config = {
    solidity: "0.8.19",
    networks: {
        localhost: {
            url: "http:127.0.0.1:7545",
        }
    }
};
exports.default = config;
