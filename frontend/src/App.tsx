import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables from .env file

declare global {
  interface Window {
    ethereum?: any;
  }
}

let contract_address = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
// let contract_address = process.env.REACT_APP_CONTRACT_ADDRESS; 

const App = () => {
  let contract: ethers.Contract;

  const [balance, setBalance] = useState<number | null>(null); // Added state for balance
  const [smartContractBalance, setSmartContractBalance] = useState<number | null>(null); // Added state for smart contract balance
  const [isConnected, setIsConnected] = useState(false); // Added state for checking if Metamask is connected
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Added state for wallet address
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false); // Added state for checking if Metamask is installed
  const [contractAddress, setContractAddress] = useState<string | null>(null); // Added state for contract address
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null); // Added state for transaction status
  
  useEffect(() => {
    checkMetamaskInstalled();
  }, []);

  const checkMetamaskInstalled = () => {
    setIsMetamaskInstalled(!!window.ethereum);
  };

  const connectWallet = async () => {
    try {
      // Connect to Metamask wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setWalletAddress(accounts[0]); // Set the wallet address
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
  };

  const getBalance = async () => {
    try {
      // Get the balance from Metamask wallet
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      setBalance(parseInt(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const connectToSmartContract = async () => {
    try {
      // Connect to the smart contract
      const Address = contract_address;
      const ABI = [
        {
          "inputs": [],
          "name": "getBalance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "status",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const resolvedSigner = await signer;
      contract = new ethers.Contract(Address, ABI, resolvedSigner);
      
      setContractAddress(contract.target.toString());
    } catch (error) {
      console.error('Failed to connect to the smart contract:', error);
    }
  }

  const getSmartContractBalance = async () => {
    try {
      await connectToSmartContract(); // Call connectToSmartContract function to connect to the smart contract
      // Get the balance from the smart contract
      const balance = await contract.getBalance();
      setSmartContractBalance(parseInt(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const makePayment = async () => {
    try {
      // Send payment to the smart contract
      const txResponse = await contract.getStatus();
      const txReceipt = await txResponse.wait();
      setTransactionStatus(txReceipt);
    } catch (error) {
      console.error('Failed to send a transaction to the smart contract:', error);
    }
  };

  useEffect(() => {
    getBalance(); // Call getBalance function to fetch the initial balance
  }, []);

  return (
    <div>
      <h1>Metamask Wallet Balance</h1>
      {isMetamaskInstalled ? (
        isConnected ? (
          <div>
            <p>Connected to Metamask wallet</p>
            <p>Wallet Address: {walletAddress}</p>
            <button onClick={getBalance}>Get Balance</button>
            {balance !== null && <p>Balance: {balance} ETH</p>}
            <button onClick={getSmartContractBalance}>Get Smart Contract Balance</button>
            {contractAddress !== null && <p>Smart Contract address: {contractAddress}</p>}
            {smartContractBalance !== null && <p>Smart Contract Balance: {smartContractBalance} ETH</p>}
            <button onClick={makePayment}>Make payment</button>
            {transactionStatus !== null && <p>Transaction status: {transactionStatus}</p>}
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )
      ) : (
        <p>Metamask is not installed</p>
      )}
    </div>
  );
};

export default App;