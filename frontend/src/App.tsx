import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const App = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Added state for wallet address
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false); // Added state for checking if Metamask is installed

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

  let contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let contract: ethers.Contract;
  const connectReactWithContract = async () => {
    try {
      // Connect to the smart contract
      const Address = contract_address;
      const ABI = [
        {
          "inputs": [],
          "name": "changeWord",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "test",
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
    
      console.log(contract.target);

    } catch (error) {
      console.error('Failed to connect React with the smart contract:', error);
    }
  };

  const readContract = async () => {
    try {
      // Call the smart contract function
      const result = await contract.test();
      console.log(result);
    } catch (error) {
      console.error('Failed to call the smart contract function:', error);
    }
  }

  const writeContract = async () => {
    try {
      const txResponse = await contract.changeWord();
      const txReceipt = await txResponse.wait();
      console.log(txReceipt);
    } catch (error) {
      console.error('Failed to send a transaction to the smart contract:', error);
    }
  }

  // /**
  //  * Sends ether to another wallet.
  //  */
  // const sendEther = async () => {
  //   try {
  //     // Send ether to another wallet
  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //     await window.ethereum.request({
  //       method: 'eth_sendTransaction',
  //       params: [
  //         {
  //           from: accounts[0], // Sender's address
  //           to: '0xBB49086f7463178Be99908eba5a6cAE21b188564', // Receiver's address (SmartSupply address)
  //           value: '0x29a2241af62c0000', // 0.1 ETH
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.error('Failed to send ether:', error);
  //   }
  // };

  // const makeTransaction = async () => {
  //   try {
  //     // Make a transaction to a smart contract
  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //     await window.ethereum.request({
  //       method: 'eth_sendTransaction',
  //       params: [
  //         {
  //           from: accounts[0], // Sender's address
  //           to: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', // Smart contract address
  //           value: '0x29a2241af62c0000', // 0.1 ETH
  //           data: '0x', // Transaction data
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.error('Failed to make transaction:', error);
  //   }
  // };

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
            {/* <button onClick={sendEther}>Send Ether</button> */}
            {/* <button onClick={makeTransaction}>Make Transaction</button> */}
            <button onClick={connectReactWithContract}>Connect React with Contract</button>
            <button onClick={readContract}>Read Contract</button>
            <button onClick={writeContract}>Write Contract</button>
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