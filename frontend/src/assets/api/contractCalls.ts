import { getContractInstance } from '../../utils/contractUtils'

export const addManufacturer = async (): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance();

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the addManufacturer function on the contract
              contract.addManufacturer()
                  .then((addManufacturerTransaction) => {
                      return addManufacturerTransaction.wait(); // Wait for the transaction to be mined
                  })
                  .then(() => {
                      console.log('addManufacturer function called successfully');
                  })
                  .catch((error) => {
                      console.error('Error calling addManufacturer:', error);
                      reject(error);
                  });

              // Set up an event listener for ManufacturerAdded
              contract.on('ManufacturerAdded', (account) => {
                  console.log('Event Captured:', account);
                  resolve(account); // Resolve the promise with the account value
              });
          });
      } else {
          console.error('Contract instance is null');
          return null;
      }
  } catch (error) {
      console.error('Failed to get role:', error);
      return null;
  }
};

export const isManufacturer = async () => {
  try {
    // Get the contract instance by awaiting the promise
    const contract = await getContractInstance();

    if (contract) {
      // Get the role from the smart contract
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      // Check if the account is a manufacturer
      const isManufacturer = await contract.isManufacturer(accounts[0])
      console.log(isManufacturer)

      return isManufacturer
    } else {
      console.error('Contract instance is null')
    }
  } catch (error) {
    console.error('Failed to get role:', error)
    return error
  }
}
