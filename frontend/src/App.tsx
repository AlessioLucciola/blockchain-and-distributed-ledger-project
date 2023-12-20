import React, { useState, useEffect } from 'react';

/**
 * Interface for the global window object to declare the ethereum property.
 */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Main component for the Metamask Wallet Balance application.
 */
const App = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Added state for wallet address
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false); // Added state for checking if Metamask is installed

  /**
   * Checks if Metamask is installed in the browser.
   */
  useEffect(() => {
    checkMetamaskInstalled();
  }, []);

  /**
   * Checks if Metamask is installed in the browser.
   */
  const checkMetamaskInstalled = () => {
    setIsMetamaskInstalled(!!window.ethereum);
  };

  /**
   * Connects to the Metamask wallet.
   */
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

  /**
   * Disconnects from the Metamask wallet.
   */
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
  };

  /**
   * Gets the balance from the Metamask wallet.
   */
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

  /**
   * Sends ether to another wallet.
   */
  const sendEther = async () => {
    try {
      // Send ether to another wallet
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0], // Sender's address
            to: '0xBB49086f7463178Be99908eba5a6cAE21b188564', // Receiver's address (SmartSupply)
            value: '0x29a2241af62c0000', // 0.1 ETH
          },
        ],
      });
    } catch (error) {
      console.error('Failed to send ether:', error);
    }
  };

  /**
   * Fetches the initial balance when the component is mounted.
   */
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
            <p>Wallet Address: {walletAddress}</p> {/* Display the wallet address */}
            <button onClick={getBalance}>Get Balance</button>
            {balance !== null && <p>Balance: {balance} ETH</p>}
            <button onClick={sendEther}>Send Ether</button>
            <button onClick={disconnectWallet}>Disconnect Wallet</button> {/* Added disconnect wallet button */}
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