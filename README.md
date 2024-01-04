# Source
Guide: https://github.com/abdulhakim-altunkaya/SOLIDITY-web3-youtube/blob/main/3_react_hardhat_goerli_ethers_write/n_react_hardhat_goerli_ethers_write.txt

Video 1: https://www.youtube.com/watch?v=z4FmbBM-H8M

Video 2: https://www.youtube.com/watch?v=HF2w3XFbnQY

# Setup
Install the dependencies with `npm install` (both in the frontend and backend folder)
If you have some dependency problems, simply delete `node_modules` and `package-lock.json` from `frontend` and `backend` folders and execute the command again.

# Backend
## CMD 1: HARDHAT
1. Connect metamask to localhost network
    ```
    npx hardhat node
    ```
    A local blockchain will be created at the "http://127.0.0.1:8545" address.

## CMD 2: DOCKER
1. Create a `.env` file in the root directory, follwing the content inside the `env.template` file.

2. Start docker
    ```
    docker compose up
    ```
    If you change the schema.prisma, you can update it by executing the command:
    ```
    npx prisma migrate dev --name init
    ```
    ⚠️ If you get any error related to `prisma` do
    ```
    npx prisma migrate deploy
    npx prisma generate
    ```
 
## CMD 3: SMARTCONTRACTS
1. Compile smart contracts by executing:
    ```
    npx hardhat compile --force
    ```

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
3. Copy the contract address into the `.env` file
4. Copy the `ABI` from `backend\artifacts\contracts\SmartSupply.sol\SmartSupply.json` to `frontend\src\assets\abi`

## CMD 4: PRISMA (optional)
1. If you want to interact with the db via a browser, start
    ```
    npx prisma studio
    ```

# Frontend
## CMD: FRONTEND
1. Install package
    ```
    npm install
    ```

2. Run frontend
    ```
    npm run dev
    ```

