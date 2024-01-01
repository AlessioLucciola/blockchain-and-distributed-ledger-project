# Source
Guide: https://github.com/abdulhakim-altunkaya/SOLIDITY-web3-youtube/blob/main/3_react_hardhat_goerli_ethers_write/n_react_hardhat_goerli_ethers_write.txt

Video 1: https://www.youtube.com/watch?v=z4FmbBM-H8M

Video 2: https://www.youtube.com/watch?v=HF2w3XFbnQY

# Setup
Install the dependencies with `npm install` (both in the frontend and backend folder)
If you have some dependency problems, simply delete `node_modules` and `package-lock.json` from `frontend` and `backend` folders and execute the command again.

# Backend
## CMD 1:
Connect metamask to localhost network by typing `npx hardhat node`.
A local blockchain will be created at the "http://127.0.0.1:8545" address.

## CMD 2:
1. Compile smart contracts by executing:
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
    Use [this site](https://lingojam.com/TexttoOneLine) to format it all on one line
2. Deploy smart contract
    ```
    npx hardhat run ./scripts/deploy.ts --network localhost
    ```
    ⚠️ If you get this error `ProviderError: Error: Transaction reverted: trying to deploy a contract whose code is too large` add this in `hardhat.config.ts`
    ```
    ...
    const config = {
        solidity: ...,
        settings: {
            optimizer: {
            enabled: true,
            runs: 200,
            details: { yul: false },
            },
        },
        networks: {
                ...
                allowUnlimitedContractSize: true,
            }
        },
    };  
    ```
3. Copy the contract address somewhere

# Frontend
## CMD: 
1. Start frontend

    ```
    npm run dev
    ```

