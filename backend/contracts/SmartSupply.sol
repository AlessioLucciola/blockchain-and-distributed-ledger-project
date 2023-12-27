// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./Entities.sol";

contract SmartSupply is
    Entities
{
    // Define the owner of the contract
    address admin;

    // Define the unique id of a product and its universal id
    // productID is used to classify each product tracked on SmartSupply
    // productUID is used to classify the same products
    // e.g. If we have two pair of shoes of the same model, the have a different productID but the same productUID 
    uint256 productID;
    uint256 productUID;

    // Define the current owner of the product
    address currentOwner;

    // Define all the stages in which a product can be within the Supply Chain
    enum ProductStage {
        Produced,
        OnSale,
        Purchased,
        Shipped,
        OnDepot
    };

    // Define the first stage (when a product is created by a manufacturer)
    ProductStage public defaultProductStage = ProductStage.Produced;

    // Define the struct of a product
    struct Product {
        uint256 productID; // productID is used to classify each product tracked on SmartSupply
        uint256 productUID; // productUID is used to classify the same products
        address currentOwner; // Address of the current owner of the product
        uint256 creationDate; // Unix timestamps that represents the time of creation of the product
        ProductStage productStage; //Stage of the product within the Supply Chain
        address manufacturer; // Address of the manufacturer who produced the product
        address distributor; // Address of the distributor who shipped the product
        address retailer; // Address of the retailer who sold the product
        address customer; // Address of the customer who owns the product
    }

    // Define some events
    event ProductProduced(uint256 productID);

    function produceProduct(uint256 _productID, uint256 _productUID) public onlyManufacturer {
        Product memory newProduct; // Define a new product in memory
        newProduct.productID = _productID; // Define the ID of the product
        newProduct.productUID = _productUID; // Define the UID of the product
        newProduct.currentOwner = _msgSender(); // Define the initial owner as the manufacturer who produced the product
        newProduct.creationDate = block.timestamp; // Assign the date of creation of the product
        newProduct.productStage = defaultProductStage; // Assign the initial default stage to the product

        // Create some placeholders for empty fields
        address distributor;
        address retailer;
        address customer;

        newProduct.manufacturer = _msgSender(); // Define the manufacturer address with the address of produced the product
        newProduct.distributor = distributor;
        newProduct.retailer = retailer;
        newProduct.customer = customer;

        // Emit the event related to the production of the product
        emit ProductProduced(_productID);
    }


}