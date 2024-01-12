import { ethers } from 'ethers'

// Function to check if MetaMask is installed
export function isMetamaskInstalled(): boolean {
    return typeof window.ethereum !== 'undefined'
}

// Function to get the connected wallet address
export async function getMetamaskAddress(): Promise<string | null> {
    if (isMetamaskInstalled()) {
        await window.ethereum.request({ method: 'eth_requestAccounts' }) // Connect to Metamask wallet
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) // Get the connected wallet address
        return ethers.getAddress(accounts[0]) // Return the wallet address
    }
    return null
}
