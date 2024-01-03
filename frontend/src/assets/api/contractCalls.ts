import { getContractInstance } from '../../utils/contractUtils'

export const addManufacturer = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()
  
        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the addManufacturer function on the contract
                contract.addManufacturer()
                    .then((addCustomerTransaction) => {
                        return addCustomerTransaction.wait()
                    })
                    .then(() => {
                        console.log('addManufacturer function called successfully')
                    })
                    .catch((error) => {
                        console.error('Error calling addManufacturer:', error)
                        reject(error)
                    })
  
                contract.on('ManufacturerAdded', (account) => {
                    console.log('Event Captured:', account)
                    resolve(account)
                })
            })
        } else {
            console.error('Contract instance is null');
            return null
        }
    } catch (error) {
        console.error('Failed to get role:', error)
        return null
    }
}

export const addCustomer = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the addCustomer function on the contract
                contract.addCustomer()
                    .then((addCustomerTransaction) => {
                        return addCustomerTransaction.wait()
                    })
                    .then(() => {
                        console.log('addCustomer function called successfully')
                    })
                    .catch((error) => {
                        console.error('Error calling addCustomer:', error)
                        reject(error)
                    })

                contract.on('CustomerAdded', (account) => {
                    console.log('Event Captured:', account)
                    resolve(account)
                })
            })
        } else {
            console.error('Contract instance is null');
            return null
        }
    } catch (error) {
        console.error('Failed to get role:', error)
        return null
    }
}

export const addRetailer = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the addRetailer function on the contract
                contract.addRetailer()
                    .then((addRetailerTransaction) => {
                        return addRetailerTransaction.wait()
                    })
                    .then(() => {
                        console.log('addRetailer function called successfully')
                    })
                    .catch((error) => {
                        console.error('Error calling addRetailer:', error)
                        reject(error)
                    })

                contract.on('RetailerAdded', (account) => {
                    console.log('Event Captured:', account)
                    resolve(account)
                })
            })
        } else {
            console.error('Contract instance is null');
            return null
        }
    } catch (error) {
        console.error('Failed to get role:', error)
        return null
    }
}

export const addDistributor = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the addDistributor function on the contract
                contract.addDistributor()
                    .then((addDistributorTransaction) => {
                        return addDistributorTransaction.wait()
                    })
                    .then(() => {
                        console.log('addDistributor function called successfully')
                    })
                    .catch((error) => {
                        console.error('Error calling addDistributor:', error)
                        reject(error)
                    })

                contract.on('DistributorAdded', (account) => {
                    console.log('Event Captured:', account)
                    resolve(account)
                })
            })
        } else {
            console.error('Contract instance is null');
            return null
        }
    } catch (error) {
        console.error('Failed to get role:', error)
        return null
    }
}

export const isManufacturer = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance();

        if (contract) {
        // Get the role from the smart contract
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        // Check if the account is a manufacturer
        const isManufacturer = await contract.isManufacturer(accounts[0])
        console.log("Entity is a manufacturer: ", isManufacturer)

        return isManufacturer
        } else {
        console.error('Contract instance is null')
        }
    } catch (error) {
        console.error('Failed to get role information:', error)
        return error
    }
}

export const isCustomer = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance();

        if (contract) {
        // Get the role from the smart contract
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        // Check if the account is a customer
        const isCustomer = await contract.isCustomer(accounts[0])
        console.log('Entity is a customer: ', isCustomer)

        return isCustomer
        } else {
        console.error('Contract instance is null')
        }
    } catch (error) {
        console.error('Failed to get role information:', error)
        return error
    }
}

export const isRetailer = async () => {
  try {
    // Get the contract instance by awaiting the promise
    const contract = await getContractInstance();

    if (contract) {
      // Get the role from the smart contract
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      // Check if the account is a retailer
      const isRetailer = await contract.isRetailer(accounts[0])
      console.log('Entity is a retailer: ', isRetailer)

      return isRetailer
    } else {
      console.error('Contract instance is null')
    }
  } catch (error) {
    console.error('Failed to get role information:', error)
    return error
  }
}

export const isDistributor = async () => {
  try {
    // Get the contract instance by awaiting the promise
    const contract = await getContractInstance();

    if (contract) {
      // Get the role from the smart contract
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      // Check if the account is a distributor
      const isDistributor = await contract.isDistributor(accounts[0])
      console.log('Entity is a distributor: ', isDistributor)

      return isDistributor
    } else {
      console.error('Contract instance is null')
    }
  } catch (error) {
    console.error('Failed to get role information:', error)
    return error
  }
}

export const removeManufacturer = async (): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance()

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the removeManufacturer function on the contract
              contract.removeManufacturer()
                  .then((removeManufacturerTransaction) => {
                      return removeManufacturerTransaction.wait()
                  })
                  .then(() => {
                      console.log('removeManufacturer function called successfully')
                  })
                  .catch((error) => {
                      console.error('Error calling removeManufacturer:', error)
                      reject(error)
                  })

              contract.on('ManufacturerRemoved', (account) => {
                  console.log('Event Captured:', account)
                  resolve(account)
              })
          })
      } else {
          console.error('Contract instance is null');
          return null
      }
  } catch (error) {
      console.error('Failed to get role:', error)
      return null
  }
}

export const removeCustomer = async (): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance()

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the removeCustomer function on the contract
              contract.removeCustomer()
                  .then((removeCustomerTransaction) => {
                      return removeCustomerTransaction.wait()
                  })
                  .then(() => {
                      console.log('removeCustomer function called successfully')
                  })
                  .catch((error) => {
                      console.error('Error calling removeCustomer:', error)
                      reject(error)
                  })

              contract.on('CustomerRemoved', (account) => {
                  console.log('Event Captured:', account)
                  resolve(account)
              })
          })
      } else {
          console.error('Contract instance is null');
          return null
      }
  } catch (error) {
      console.error('Failed to get role:', error)
      return null
  }
}

export const removeRetailer = async (): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance()

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the removeRetailer function on the contract
              contract.removeRetailer()
                  .then((removeRetailerTransaction) => {
                      return removeRetailerTransaction.wait()
                  })
                  .then(() => {
                      console.log('removeRetailer function called successfully')
                  })
                  .catch((error) => {
                      console.error('Error calling removeRetailer:', error)
                      reject(error)
                  })

              contract.on('RetailerRemoved', (account) => {
                  console.log('Event Captured:', account)
                  resolve(account)
              })
          })
      } else {
          console.error('Contract instance is null');
          return null
      }
  } catch (error) {
      console.error('Failed to get role:', error)
      return null
  }
}

export const removeDistributor = async (): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance()

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the removeDistributor function on the contract
              contract.removeDistributor()
                  .then((removeDistributorTransaction) => {
                      return removeDistributorTransaction.wait()
                  })
                  .then(() => {
                      console.log('removeDistributor function called successfully')
                  })
                  .catch((error) => {
                      console.error('Error calling removeDistributor:', error)
                      reject(error)
                  })

              contract.on('DistributorRemoved', (account) => {
                  console.log('Event Captured:', account)
                  resolve(account)
              })
          })
      } else {
          console.error('Contract instance is null');
          return null
      }
  } catch (error) {
      console.error('Failed to get role:', error)
      return null
  }
}

export const isVerificationPermitted = async () => {
  try {
    // Get the contract instance by awaiting the promise
    const contract = await getContractInstance();

    if (contract) {
      // Get the role from the smart contract
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      // Check if the account is sent a proof of their identity and was accepted by the admin
      const isVerificationPermitted = await contract.isVerificationPermitted(accounts[0])
      console.log('Entity proof is accepted: ', isVerificationPermitted)

      return isVerificationPermitted
    } else {
      console.error('Contract instance is null')
    }
  } catch (error) {
    console.error('Failed to get role information:', error)
    return error
  }
}

export const grantVerificationPermission = async (accountAddress: string): Promise<string | null> => {
  try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance()

      if (contract) {
          // Create a promise to resolve when the event is emitted
          return new Promise((resolve, reject) => {
              // Call the grantVerificationPermission function on the contract
              contract.grantVerificationPermission(accountAddress)
                  .then((grantVerificationPermissionTransaction) => {
                      return grantVerificationPermissionTransaction.wait()
                  })
                  .then(() => {
                      console.log('grantVerificationPermission function called successfully')
                  })
                  .catch((error) => {
                      console.error('Error calling grantVerificationPermission:', error)
                      reject(error)
                  });

              contract.on('VerificationPermissionGranted', (account) => {
                  console.log('Event Captured:', account)
                  resolve(account)
              });
          });
      } else {
          console.error('Contract instance is null')
          return null
      }
  } catch (error) {
      console.error('Failed to get role:', error)
      return null
  }
}

export const verifyEntity = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()
  
        if (contract) {
            // Convert the amount to send (20 Wei)
            const amountToSend = "20"

            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the verifyEntity function on the contract with the specified value
                contract.verifyEntity({ value: BigInt(amountToSend) })
                    .then((verifyEntityTransaction) => {
                        return verifyEntityTransaction.wait()
                    })
                    .then(() => {
                        console.log('verifyEntity function called successfully')
                    })
                    .catch((error) => {
                        console.error('Error calling VerifyEntity:', error)
                        reject(error);
                    });
  
                contract.on('EntityVerified', (account) => {
                    console.log('Event Captured:', account)
                    resolve(account);
                });
            });
        } else {
            console.error('Contract instance is null');
            return null
        }
    } catch (error) {
        console.error('Failed to get role:', error);
        return null
    }
}

export const isVerified = async () => {
    try {
      // Get the contract instance by awaiting the promise
      const contract = await getContractInstance();
  
      if (contract) {
        // Get the role from the smart contract
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  
        // Check if the account paid to get verified
        const isVerified = await contract.isVerified(accounts[0])
        console.log('Entity is verified ', isVerified)
  
        return isVerified
      } else {
        console.error('Contract instance is null')
      }
    } catch (error) {
      console.error('Failed to get role information:', error)
      return error
    }
  }