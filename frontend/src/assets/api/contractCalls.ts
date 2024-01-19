import { ethers } from "ethers"
import { Roles } from "../../shared/constants"
import { getContractInstance } from "../../utils/contractUtils"
import { getMetamaskAddress } from "../../utils/metamaskUtils"
import { fetchETHPrice } from "../../utils/fetchETHPrice"

export const addManufacturer = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                contract.on("ManufacturerAdded", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the addManufacturer function on the contract
                const res = contract
                    .addManufacturer()
                    .then((addManufacturerTransaction) => {
                        addManufacturerTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "addManufacturer function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling addManufacturer:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("CustomerAdded", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the addCustomer function on the contract
                contract
                    .addCustomer()
                    .then((addCustomerTransaction) => {
                        return addCustomerTransaction.wait()
                    })
                    .then(() => {
                        console.log("addCustomer function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling addCustomer:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("RetailerAdded", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the addRetailer function on the contract
                contract
                    .addRetailer()
                    .then((addRetailerTransaction) => {
                        return addRetailerTransaction.wait()
                    })
                    .then(() => {
                        console.log("addRetailer function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling addRetailer:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("DistributorAdded", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the addDistributor function on the contract
                contract
                    .addDistributor()
                    .then((addDistributorTransaction) => {
                        return addDistributorTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "addDistributor function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling addDistributor:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
        return null
    }
}

export const isManufacturer = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account is a manufacturer
            const isManufacturer = await contract.isManufacturer(account)
            console.log("Entity is a manufacturer: ", isManufacturer)

            return isManufacturer
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const isCustomer = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account is a customer
            const isCustomer = await contract.isCustomer(account)
            console.log("Entity is a customer: ", isCustomer)

            return isCustomer
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const isRetailer = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account is a retailer
            const isRetailer = await contract.isRetailer(account)
            console.log("Entity is a retailer: ", isRetailer)

            return isRetailer
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const isDistributor = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account is a distributor
            const isDistributor = await contract.isDistributor(account)
            console.log("Entity is a distributor: ", isDistributor)

            return isDistributor
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const isManufacturerByAddress = async (address: string) => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Returns a boolean that tells if the entity is a manufacturer
            const productInfo = await contract.manufacturers(address)
            return productInfo
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role info:", error)
        return error
    }
}

export const isDistributorByAddress = async (address: string) => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Returns a boolean that tells if the entity is a distributor
            const productInfo = await contract.distributors(address)
            return productInfo
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role info:", error)
        return error
    }
}

export const isRetailerByAddress = async (address: string) => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Returns a boolean that tells if the entity is a retailer
            const productInfo = await contract.retailers(address)
            return productInfo
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role info:", error)
        return error
    }
}

export const isCustomerByAddress = async (address: string) => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Returns a boolean that tells if the entity is a customer
            const productInfo = await contract.customers(address)
            return productInfo
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role info:", error)
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
                contract.on("ManufacturerRemoved", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the removeManufacturer function on the contract
                contract
                    .removeManufacturer()
                    .then((removeManufacturerTransaction) => {
                        return removeManufacturerTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "removeManufacturer function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error(
                            "Error calling removeManufacturer:",
                            error
                        )
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("CustomerRemoved", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the removeCustomer function on the contract
                contract
                    .removeCustomer()
                    .then((removeCustomerTransaction) => {
                        return removeCustomerTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "removeCustomer function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling removeCustomer:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("RetailerRemoved", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the removeRetailer function on the contract
                contract
                    .removeRetailer()
                    .then((removeRetailerTransaction) => {
                        return removeRetailerTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "removeRetailer function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling removeRetailer:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
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
                contract.on("DistributorRemoved", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })

                // Call the removeDistributor function on the contract
                contract
                    .removeDistributor()
                    .then((removeDistributorTransaction) => {
                        return removeDistributorTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "removeDistributor function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling removeDistributor:", error)
                        reject(error)
                    })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
        return null
    }
}

export const getEntityRole = async (): Promise<Roles | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Check if the account is a manufacturer
            if (await isManufacturer()) {
                return Roles.MANUFACTURER
            } else if (await isDistributor()) {
                return  Roles.DISTRIBUTOR
            } else if (await isRetailer()) {
                return Roles.RETAILER
            } else if (await isCustomer()) {
                return Roles.CUSTOMER
            }
            return null
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return null
    }
}

export const isVerificationPermitted = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account is sent a proof of their identity and was accepted by the admin
            const isVerificationPermitted =
                await contract.isVerificationPermitted(account)
            console.log("Entity proof is accepted: ", isVerificationPermitted)

            return isVerificationPermitted
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const grantVerificationPermission = async (
    accountAddress: string
): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the grantVerificationPermission function on the contract
                contract
                    .grantVerificationPermission(accountAddress)
                    .then((grantVerificationPermissionTransaction) => {
                        return grantVerificationPermissionTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "grantVerificationPermission function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error(
                            "Error calling grantVerificationPermission:",
                            error
                        )
                        reject(error)
                    })

                contract.on("VerificationPermissionGranted", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
        return null
    }
}

export const verifyEntity = async (): Promise<string | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the amount of coins that the entity has to send to get verified
            let verificationAmount = await getVerificationAmount()

            // Convert verificationAmount from ether to gwei
            verificationAmount = ethers.parseUnits(verificationAmount.toString(), "ether").toString();

            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the verifyEntity function on the contract with the specified value
                contract
                    .verifyEntity({ value: BigInt(verificationAmount) })
                    .then((verifyEntityTransaction) => {
                        return verifyEntityTransaction.wait()
                    })
                    .then(() => {
                        console.log("verifyEntity function called successfully")

                        return verificationAmount
                    })
                    .catch((error) => {
                        console.error("Error calling VerifyEntity:", error)
                        reject(error)
                    })

                contract.on("EntityVerified", (account) => {
                    console.log("Event Captured:", account)
                    resolve(account)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to get role:", error)
        return null
    }
}

export const isVerified = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the role from the smart contract
            const account = getMetamaskAddress()

            // Check if the account paid to get verified
            const isVerified = await contract.isVerified(account)
            console.log("Entity is verified ", isVerified)

            return isVerified
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get role information:", error)
        return error
    }
}

export const getVerificationAmount = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            let verificationAmount = await contract.getVerificationAmount()
            verificationAmount = ethers.formatUnits(verificationAmount, "ether");

            console.log("Verification amount: ", verificationAmount.toString(), "ETH")

            return verificationAmount.toString()
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get verification amount:", error)
        return error
    }
}

export const changeVerificationAmount = async (
    _verificationAmount: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted

            let newVerificationAmount = ethers.parseUnits(_verificationAmount.toString(), "ether");

            return new Promise((resolve, reject) => {
                // Call the productProduct function on the contract by sending the id and uid of a product
                contract
                    .setVerificationAmount(newVerificationAmount)
                    .then((verificationAmountTransaction) => {
                        return verificationAmountTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "setVerificationAmount function called successfully"
                        )
                        return _verificationAmount 
                    })
                    .catch((error) => {
                        console.error("Error calling setVerificationAmount:", error)
                        reject(error)
                    })

                contract.on("VerificationAmountChanged", (admin, verificationAmount) => {
                    const event_ret = {
                        admin: admin,
                        verificationAmount: verificationAmount,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to produce a product:", error)
        return null
    }
}

export const getCertificationPercentage = async () => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            const certificationPercentage = await contract.getCertificationPercentage()
            console.log("Certification percentage: ", certificationPercentage.toString())

            return certificationPercentage.toString()
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get certification percentage:", error)
        return error
    }
}

export const changeCertificationPercentage = async (
    _certificationPercentage: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the productProduct function on the contract by sending the id and uid of a product
                contract
                    .setCertificationPercentage(_certificationPercentage)
                    .then((certificationPercentageTransaction) => {
                        return certificationPercentageTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "setCertificationPercentage function called successfully"
                        )
                        return _certificationPercentage 
                    })
                    .catch((error) => {
                        console.error("Error calling setCertificationPercentage:", error)
                        reject(error)
                    })

                contract.on("CertificationPercentageChanged", (admin, certificationPercentage) => {
                    const event_ret = {
                        admin: admin,
                        certificationPercentage: certificationPercentage,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to produce a product:", error)
        return null
    }
}

export const produceProduct = async (
    _productID: number,
    _productUID: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the productProduct function on the contract by sending the id and uid of a product
                contract
                    .produceProduct(_productID, _productUID)
                    .then((produceProductTransaction) => {
                        return produceProductTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "produceProduct function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling produceProduct:", error)
                        reject(error)
                    })

                contract.on("ProductProduced", (productId, manufacturer) => {
                    const event_ret = {
                        productId: productId,
                        manufacturer: manufacturer,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to produce a product:", error)
        return null
    }
}

export const getContractProductInfo = async (_productID: number) => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Get the struct with the info on a product
            const productInfo = await contract.products(_productID)
            //console.log("Info of the product: ", productInfo)

            return productInfo
        } else {
            console.error("Contract instance is null")
        }
    } catch (error) {
        console.error("Failed to get product information:", error)
        return error
    }
}

export const changeBankTransactionID = async (
    _productID: number,
    _transactionID: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()
        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the changeBankTransactionID function to change the bank transaction ID of a payment
                contract
                    .changeBankTransactionID(_productID, _transactionID)
                    .then((changeBankTransactionIDTransaction) => {
                        return changeBankTransactionIDTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "changeBankTransactionID function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error(
                            "Error calling changeBankTransactionID:",
                            error
                        )
                        reject(error)
                    })

                contract.on("BankTransactionChanged", (productID, entity) => {
                    const event_ret = {
                        productId: productID,
                        entity: entity,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to change the bank transaction ID:", error)
        return null
    }
}

export const changeOnSale = async (_productID: number): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the changeOnSale function to flag an owned product as "on sale"
                contract
                    .changeOnSale(_productID)
                    .then((changeOnSaleTransaction) => {
                        return changeOnSaleTransaction.wait()
                    })
                    .then(() => {
                        console.log("changeOnSale function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling changeOnSale:", error)
                        reject(error)
                    })

                contract.on("ChangedOnSale", (productID, owner) => {
                    const event_ret = {
                        productId: productID,
                        owner: owner,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error(
            'Failed to change the state of a product to "onSale":',
            error
        )
        return null
    }
}

export const changeOnSaleRetailer = async (_productID: number, _retailerPrice: number): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            let newRetailerPrice = ethers.parseUnits(_retailerPrice!.toString(), "gwei").toString();

            return new Promise((resolve, reject) => {
                // Call the changeOnSale function to flag an owned product as "on sale"
                contract
                    .changeOnSaleRetailer(_productID, newRetailerPrice)
                    .then((changeOnSaleTransaction) => {
                        return changeOnSaleTransaction.wait()
                    })
                    .then(() => {
                        console.log("changeOnSaleRetailer function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling changeOnSale:", error)
                        reject(error)
                    })

                contract.on("ChangedOnSaleRetailer", (productID, owner) => {
                    const event_ret = {
                        productId: productID,
                        owner: owner,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error(
            'Failed to change the state of a product to "onSale":',
            error
        )
        return null
    }
}

export const changeNotOnSale = async (_productID: number): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise((resolve, reject) => {
                // Call the changeNotOnSale function to flag an owned product as "on sale"
                contract
                    .changeNotOnSale(_productID)
                    .then((changeNotOnSaleTransaction) => {
                        return changeNotOnSaleTransaction.wait()
                    })
                    .then(() => {
                        console.log("changeNotOnSale function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling changeNOtOnSale:", error)
                        reject(error)
                    })

                contract.on("ChangedNotOnSale", (productID, owner) => {
                    const event_ret = {
                        productId: productID,
                        owner: owner,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error(
            'Failed to change the state of a product to "onSale":',
            error
        )
        return null
    }
}

export const purchaseProduct = async (
    _productID: number,
    _productPrice: number,
    _certificationPrice: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise(async (resolve, reject) => {
                // Call the purchaseProduct function to purchase a product
                if (await isCustomer()) {
                    let newCertificationPrice = ethers.parseUnits(_certificationPrice!.toString(), "ether").toString();

                    // If the entity is a customer, he also has to send a certain amount of coins to the get product certification
                    contract
                        .purchaseProduct(_productID, { value: BigInt(newCertificationPrice), to: contract.address, from: getMetamaskAddress() })
                        .then((purchaseProductTransaction) => {
                            return purchaseProductTransaction.wait()
                        })
                        .then(() => {
                            console.log(
                                "purchaseProduct function called successfully"
                            )
                        })
                        .catch((error) => {
                            console.error(
                                "Error calling purchaseProduct:",
                                error
                            )
                            reject(error)
                        })
                } else {
                    contract
                        .purchaseProduct(_productID)
                        .then((purchaseProductTransaction) => {
                            return purchaseProductTransaction.wait()
                        })
                        .then(() => {
                            console.log(
                                "purchaseProduct function called successfully"
                            )
                        })
                        .catch((error) => {
                            console.error(
                                "Error calling purchaseProduct:",
                                error
                            )
                            reject(error)
                        })
                }

                contract.on(
                    "ProductPurchased",
                    (productID, oldOwner, newOwner) => {
                        const event_ret = {
                            productId: productID,
                            oldOwner: oldOwner,
                            newOwner: newOwner,
                        }
                        console.log("Event Captured:", event_ret)
                        resolve(event_ret)
                    }
                )
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to puchase a product:", error)
        return null
    }
}

export const shipProduct = async (
    _productID: number,
    _receiver: string
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise(async (resolve, reject) => {
                // Call the shipProduct function to ship a product
                contract
                    .shipProduct(_productID, _receiver)
                    .then((shipProductTransaction) => {
                        return shipProductTransaction.wait()
                    })
                    .then(() => {
                        console.log("shipProduct function called successfully")
                    })
                    .catch((error) => {
                        console.error("Error calling shipProduct:", error)
                        reject(error)
                    })

                contract.on("ProductShipped", (productID, sender, receiver) => {
                    const event_ret = {
                        productId: productID,
                        sender: sender,
                        receiver: receiver,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to puchase a product:", error)
        return null
    }
}

export const receiveProduct = async (
    _productID: number
): Promise<any | null> => {
    try {
        // Get the contract instance by awaiting the promise
        const contract = await getContractInstance()

        if (contract) {
            // Create a promise to resolve when the event is emitted
            return new Promise(async (resolve, reject) => {
                // Call the receiveProduct function to mark a product as received
                contract
                    .receiveProduct(_productID)
                    .then((receiveProductTransaction) => {
                        return receiveProductTransaction.wait()
                    })
                    .then(() => {
                        console.log(
                            "receiveProduct function called successfully"
                        )
                    })
                    .catch((error) => {
                        console.error("Error calling receiveProduct:", error)
                        reject(error)
                    })

                contract.on("ProductReceived", (productID, receiver) => {
                    const event_ret = {
                        productId: productID,
                        receiver: receiver,
                    }
                    console.log("Event Captured:", event_ret)
                    resolve(event_ret)
                })
            })
        } else {
            console.error("Contract instance is null")
            return null
        }
    } catch (error) {
        console.error("Failed to puchase a product:", error)
        return null
    }
}
