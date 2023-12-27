# Source
Guide: https://github.com/abdulhakim-altunkaya/SOLIDITY-web3-youtube/blob/main/3_react_hardhat_goerli_ethers_write/n_react_hardhat_goerli_ethers_write.txt

Video 1: https://www.youtube.com/watch?v=z4FmbBM-H8M

Video 2: https://www.youtube.com/watch?v=HF2w3XFbnQY

# Setup
1. Install
    ```
    npm install --save-dev hardhat
    npm install --save-dev dotenv
    npm install --save-dev @openzeppelin/contracts
    npm install --save-dev @nomicfoundation/hardhat-toolbox 
    npm install --save-dev "@nomiclabs/hardhat-ethers@^2.0.0"
    npm install --save-dev ethers
    npm install --save-dev "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^1.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "@types/mocha@^9.1.0" "@typechain/ethers-v5@^10.1.0" "@typechain/hardhat@^6.1.2" "chai@^4.2.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.7.21" "ts-node@>=8.0.0" "typechain@^8.1.0" "typescript@>=4.5.0"
    ```
2. Connect metamask to localhost network
    ```
    http:127.0.0.1:7545
    ```
3. Create hardhat project (backend)
    ```
    npx hardhat
    ```

# Backend
## CMD 1:
1. Start hardhat node
    ```
    npx hardhat node
    ```

## CMD 2:
1. Compile smart contract
    ```
    npx hardhat compile --force
    ```
2. Remember to copy the content of `abi` from `...\artifacts\contracts\<contract_name>.sol\<contract_name>.json`
    ```
    "sourceName": ...,
    "abi": [
        ...
    ],
    "bytecode": ...
    ```
2. Deploy smart contract
    ```
    npx hardhat run ./scripts/deploy.ts --network localhost
    ```
3. Copy the contract address somewhere

# Frontend
## CMD: 
1. Start frontend

    ```
    npm start
    ```

