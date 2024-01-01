import { ethers } from 'ethers'
import MyContractABI from '../assets/abi/SmartSupply.json'

let contractInstance: ethers.Contract | null = null;

export function getContractInstance(): ethers.Contract {
  if (!contractInstance) {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Load the contract ABI
        const contractAddress = process.env.REACT_APP_SMART_SUPPLY_CONTRACT_ADDRESS || '0xDefaultContractAddress'
        contractInstance = new ethers.Contract(contractAddress, MyContractABI, provider)

        return contractInstance
    } catch (error) {
        console.error('Failed to connect to the smart contract:', error)
    }
  }
}