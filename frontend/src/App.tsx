import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

let contract_address = process.env.REACT_APP_SMART_SUPPLY_CONTRACT_ADDRESS || "";
let abi = process.env.REACT_APP_SMART_SUPPLY_CONTRACT_ABI || "";
const App = () => {
  let contract: ethers.Contract;

  const [balance, setBalance] = useState<number | null>(null); // Added state for balance
  const [isConnected, setIsConnected] = useState(false); // Added state for checking if Metamask is connected
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Added state for wallet address
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false); // Added state for checking if Metamask is installed
  const [isManufacturer, setIsManufacturer] = useState<string | null>(null); // Added state for role

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const resolvedSigner = await signer;
      contract = new ethers.Contract(contract_address, abi, resolvedSigner);

      if (contract !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to connect to the smart contract:', error);
    }
  }
  const AddManufacturer = async () => {
    try {
      if (await connectToSmartContract()) {
        // Get the role from smart contract
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const addManufacturer = await contract.addManufacturer();
        await addManufacturer.wait(); // Wait for the transaction to be mined
        console.log('addManufacturer function called successfully');

        // Check if the account is a manufacturer
        const result = await contract.isManufacturer(accounts[0]);
        setIsManufacturer(result.toString());
      } else {
        console.log("Smart contract not connected");
      }
    } catch (error) {
      console.error('Failed to get role:', error);
    }
  }

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
            <button onClick={AddManufacturer}>Add manufacturer</button>
            {isManufacturer !== null && <p>isManufacturer: {isManufacturer}</p>}
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