// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract Utils {
    // Define the first stage and location (when a product is created by a manufacturer)
    ProductStage public defaultProductStage = ProductStage.Produced;
    ProductLocation public defaultProductLocation = ProductLocation.InFactory;

    // Define the struct of a product
    struct Product {
        uint256 productID; // productID is used to classify each product tracked on SmartSupply
        uint256 productUID; // productUID is used to classify the same products
        address previousOwner; // Address of the previous owner of the product
        address currentOwner; // Address of the current owner of the product
        uint creationDate; // Unix timestamps that represents the time of creation of the product
        uint certificationPrice; // Price of the certification of the product
        ProductStage productStage; // Stage of the product within the Supply Chain
        ProductLocation productLocation; // Enum to track the location of the product
        Ownerships ownerships; // Struct to store the ownerships in the supply chain
        TransactionIDs transactionIDs; // Struct to store bank transaction IDs
        ProductRewards rewards; // Struct to save the information on the given rewards
    }

    // Define all the stages in which a product can be within the Supply Chain
    enum ProductStage {
        Produced,
        OnSale,
        NotOnSale,
        Purchased,
        Shipped,
        Received
    }

    // Define all the locations in which a product can be within the Supply Chain
    enum ProductLocation {
        InFactory,
        InDistributor,
        InRetailer,
        InCustomer,
        Shipping
    }

    // Struct to store bank transaction IDs
    struct TransactionIDs {
        uint256 distributorBankTransactionID;
        uint256 retailerBankTransactionID;
        // Add other fields if needed
    }

    // Struct to store if an entity has been already rewarded or not
    struct ProductRewards {
        bool manufacturerRewarded;
        bool distributorRewarded;
        bool retailerRewarded;
    }

    // Struct to represent the roles in the supply chain
    struct Ownerships {
        address manufacturer;
        address distributor;
        address retailer;
        address customer;
    }

    // Define some events that are used in the SmartSupply contract
    event ProductProduced(uint256 productID, address manufacturer);
    event ChangedOnSaleRetailer(uint256 productID, address retailer, uint256 newCertificationPrice);   
    event ChangedOnSale(uint256 productID, address owner);
    event ChangedNotOnSale(uint256 productID, address owner);
    event ProductPurchased(uint256 productID, address oldOwner, address newOwner);
    event ProductShipped(uint256 productID, address sender, address receiver);
    event ProductReceived(uint256 productID, address receiver);
    event BankTransactionChanged(uint256 productID, address entity);
    event RewardGiven(address receiver, uint256 amount);
}