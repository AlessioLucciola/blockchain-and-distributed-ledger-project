# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# Notes for us:
First you have to create a .env file in the root directory, follwing the content inside the env.template file.

Then you can run the database along with the app by doing

```

docker compose up

```

If you change the schema.prisma, you can update it by executing the command:

```

npx prisma migrate dev --name init

```