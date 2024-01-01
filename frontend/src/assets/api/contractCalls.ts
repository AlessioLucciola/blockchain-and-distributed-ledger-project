import { getContractInstance } from '../../utils/contractUtils'

export const addManufacturer = async () => {
  try {
    // Get the contract instance by awaiting the promise
    const contract = await getContractInstance();

    if (contract) {
      // Get the role from the smart contract
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      // Call the addManufacturer function on the contract
      const addManufacturerTransaction = await contract.addManufacturer();
      await addManufacturerTransaction.wait(); // Wait for the transaction to be mined
      console.log('addManufacturer function called successfully');

      // Check if the account is a manufacturer
      const isManufacturer = await contract.isManufacturer(accounts[0])
      console.log(isManufacturer)

      return isManufacturer;
    } else {
      console.error('Contract instance is null');
    }
  } catch (error) {
    console.error('Failed to get role:', error);
  }
};
