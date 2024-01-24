# SmartSupply
This project was done by:
*   Danilo Corsi (matr. 1742375)
*   Alessio Lucciola (matr. 1823638)
*   Domiziano Scarcelli (matr. 1872664)

The project is composed by two subfolders "frontend" and "backend". The smart contract files are stored in "./backend/contracts/*".

## Setup
Install the dependencies with `npm install` (both in the frontend and backend folder)
If you have some dependency problems, simply delete `node_modules` and `package-lock.json` from `frontend` and `backend` folders and execute the command again.

## Backend
### CMD 1: HARDHAT
1. Connect metamask to localhost network
    ```
    npx hardhat node
    ```
    A local blockchain will be created at the "http://127.0.0.1:8545" address.

### CMD 2: DOCKER
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
 
### CMD 3: SMARTCONTRACTS
1. Compile smart contracts by executing:
    ```
    npx hardhat compile --force
    ```

2. Deploy smart contract
    ```
    npx hardhat run ./scripts/deploy.ts --network localhost
3. Copy the contract address into the `.env` file
4. Copy the `SmartSupply.json` from `backend\artifacts\contracts\SmartSupply.sol` folder to `frontend\src\assets\abi`

### CMD 4: PRISMA (optional)
1. If you want to interact with the db via a browser, start
    ```
    npx prisma studio
    ```

## Frontend
### CMD: FRONTEND
1. Install package
    ```
    npm install
    ```

2. Run frontend
    ```
    npm run dev
    ```

