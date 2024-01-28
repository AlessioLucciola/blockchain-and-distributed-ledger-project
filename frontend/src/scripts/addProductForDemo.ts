import { getEntityByAddress, registerEntity, injectProduct } from "../assets/api/apiCalls"
import { addEntitiesForDemo, isCustomerByAddress, isDistributorByAddress, isManufacturerByAddress, isRetailerByAddress, produceProductForDemo } from "../assets/api/contractCalls"
import { Roles } from "../shared/constants"
import { Entity } from "../shared/types"

const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const manufacturerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const distributorAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
const retailerAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
const customerAddress = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"

export async function registerEntities() {
    const addEntities = await addEntitiesForDemo(manufacturerAddress, distributorAddress, retailerAddress, customerAddress)
    if (addEntities) {
        const manufacturerData: Entity = {
            name: "",
            surname: "",
            email: "man@man.it",
            password: "test",
            address_1: "",
            address_2: "",
            companyName: "Nike Manufacturer",
            shopName: "Nike Manufacturer",
            metamaskAddress: manufacturerAddress,
            role: Roles.MANUFACTURER,
            verificationID: "",
            accountVerified: false,
        }

        const distributorData: Entity = {
            name: "",
            surname: "",
            email: "dis@dis.it",
            password: "test",
            address_1: "",
            address_2: "",
            companyName: "Nike Distributor",
            shopName: "Nike Distributor",
            metamaskAddress: distributorAddress,
            role: Roles.DISTRIBUTOR,
            verificationID: "",
            accountVerified: false,
        }

        const retailerData: Entity = {
            name: "",
            surname: "",
            email: "ret@ret.it",
            password: "test",
            address_1: "",
            address_2: "",
            companyName: "Nike Retailer",
            shopName: "Nike Retailer",
            metamaskAddress: retailerAddress,
            role: Roles.RETAILER,
            verificationID: "",
            accountVerified: false,
        }

        const customerData: Entity = {
            name: "Mario",
            surname: "Rossi",
            email: "cus@cus.it",
            password: "test",
            address_1: "",
            address_2: "",
            companyName: "",
            shopName: "",
            metamaskAddress: customerAddress,
            role: Roles.CUSTOMER,
            verificationID: "",
            accountVerified: false,
        }

        const adminData: Entity = {
            name: "Admin",
            surname: "Admin",
            email: "admin@admin.it",
            password: "test",
            address_1: "",
            address_2: "",
            companyName: "",
            shopName: "",
            metamaskAddress: adminAddress,
            role: Roles.ADMIN,
            verificationID: "",
            accountVerified: false,
        }

        registerEntity(manufacturerData)
        registerEntity(distributorData)
        registerEntity(retailerData)
        registerEntity(customerData)
        registerEntity(adminData)
    }
}

export async function addProductForDemo() {
    let manufacturerInfo: Entity | undefined
    let distributorInfo: Entity | undefined
    let retailerInfo: Entity | undefined
    let customerInfo: Entity | undefined
    
    if (await isManufacturerByAddress(manufacturerAddress)) {
        const res = await getEntityByAddress({address: manufacturerAddress})
        if (res.status === 200) {
            manufacturerInfo = res.data.data
            console.log(manufacturerInfo)
        }
    } else {
        console.error("Manufacturer not found")
        return
    }

    if (await isDistributorByAddress(distributorAddress)) {
        const res = await getEntityByAddress({address: distributorAddress})
        if (res.status === 200) {
            distributorInfo = res.data.data
            console.log(distributorInfo)
        }
    } else {
        console.error("Distributor not found")
        return 
    }

    if (await isRetailerByAddress(retailerAddress)) {
        const res = await getEntityByAddress({address: retailerAddress})
        if (res.status === 200) {
            retailerInfo = res.data.data
            console.log(retailerInfo)
        }
    } else {
        console.error("Retailer not found")
        return 
    }

    if (await isCustomerByAddress(customerAddress)) {
        const res = await getEntityByAddress({address: customerAddress})
        if (res.status === 200) {
            customerInfo = res.data.data
            console.log(customerInfo)
        }
    } else {
        console.error("Customer not found")
        return 
    }

    const productName = "Nike shoes"
    const productDescription = "Nike is a renowned global brand specializing in athletic footwear, apparel, and accessories."
    const retailerPrice = 50

    if (manufacturerInfo !== undefined || !distributorInfo !== undefined || !retailerInfo !== undefined || !customerInfo !== undefined) {
        const res = await injectProduct({name: productName, description: productDescription, manufacturerPrice: 10, distributorPrice: 20, retailerPrice: retailerPrice, manufacturerId: parseInt(manufacturerInfo?.id!), distributorId: parseInt(distributorInfo?.id!), retailerId: parseInt(retailerInfo?.id!)})
        const newProductID = res.newProductID
        const newProductUID = res.newProductUID
        if (newProductID !== undefined && newProductUID !== undefined) {
            produceProductForDemo(newProductID, newProductUID, manufacturerAddress, distributorAddress, retailerAddress, retailerPrice.toString())
        }
    }
    
}