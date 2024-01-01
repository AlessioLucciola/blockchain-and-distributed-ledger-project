import { ethers } from 'ethers';
import MyContractABI from '../assets/abi/SmartSupply.json';

let contractInstance: ethers.Contract | null = null;

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getContractInstance = async (): Promise<ethers.Contract | null> => {
  if (!contractInstance) {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask not detected. Make sure it is installed and active.')
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum)

      // Load the contract ABI
      const contractAddress = process.env.REACT_APP_SMART_SUPPLY_CONTRACT_ADDRESS || '0xDefaultContractAddress'
      const signer = await provider.getSigner();
      contractInstance = new ethers.Contract(contractAddress, MyContractABI.abi, signer)

      return contractInstance;
    } catch (error) {
      console.error('Failed to connect to the smart contract:', error)
      return null
    }
  } else {
    return contractInstance;
  }
};