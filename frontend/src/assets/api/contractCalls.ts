import { getContractInstance } from '../../utils/contractUtils'

const contract = getContractInstance()

export const addManufacturer = async () => {
    try {
        // Get the role from smart contract
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const addManufacturer = await contract.addManufacturer()
        await addManufacturer.wait(); // Wait for the transaction to be mined
        console.log('addManufacturer function called successfully')

        // Check if the account is a manufacturer
        console.log(contract.isManufacturer(accounts[0]))
        return await contract.isManufacturer(accounts[0])
    } catch (error) {
      console.error('Failed to get role:', error);
    }
}
