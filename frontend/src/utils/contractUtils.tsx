import { ethers } from 'ethers';
import MyContractABI from '../assets/abi/SmartSupply.json';

let contractInstance: ethers.Contract | null = null;

declare global {
  interface Window {
    ethereum?: any
  }
}

export const getContractInstance = async (): Promise<ethers.Contract | null> => {
  if (!contractInstance) {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask not detected. Make sure it is installed and active.')
        return null
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      provider.pollingInterval = 100

      // Load the contract ABI
      const contractAddress = import.meta.env.VITE_SMART_SUPPLY_CONTRACT_ADDRESS || '0xDefaultContractAddress'
      const signer = provider.getSigner()
      const resolvedSigner = await signer
      contractInstance = new ethers.Contract(contractAddress, MyContractABI.abi, resolvedSigner)

      return contractInstance
    } catch (error) {
      console.error('Failed to connect to the smart contract:', error)
      return null
    }
  } else {
    return contractInstance
  }
}