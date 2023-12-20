import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      <h1>Metamask Wallet Balance</h1>
      {isMetamaskInstalled ? (
        isConnected ? (
          <div>
            <p>Connected to Metamask wallet</p>
            <p>Wallet Address: {walletAddress}</p> {/* Display the wallet address */}
            <button onClick={getBalance}>Get Balance</button>
            {balance !== null && <p>Balance: {balance} ETH</p>}
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
