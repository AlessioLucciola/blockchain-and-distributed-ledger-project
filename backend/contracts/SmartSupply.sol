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

    // Define a mapping that maps each productID to its corresponding struct
    mapping(uint256 => Product) products;

    // Define the current owner of the product
    address currentOwner;

    // Define all the stages in which a product can be within the Supply Chain
    enum ProductStage {
        Produced,
        OnSale,
        Purchased,
        Shipped,
        Received
    }

    // Define all the locations in which a product can be within the Supply Chain
    enum ProductStatus {
        InFactory,
        InDistributor,
        InRetailer,
        InCustomer,
        Shipping
    }

    // Define the first stage and location (when a product is created by a manufacturer)
    ProductStage public defaultProductStage = ProductStage.Produced;
    ProductStatus public defaultProductStatus = ProductStatus.InFactory;

    // Define the struct of a product
    struct Product {
        uint256 productID; // productID is used to classify each product tracked on SmartSupply
        uint256 productUID; // productUID is used to classify the same products
        address previousOwner; // Address of the previous owner of the product
        address currentOwner; // Address of the current owner of the product
        uint256 creationDate; // Unix timestamps that represents the time of creation of the product
        ProductStage productStage; // Stage of the product within the Supply Chain
        ProductStatus productStatus; // Enum to track the location of the product
        address manufacturer; // Address of the manufacturer who produced the product
        address distributor; // Address of the distributor who shipped the product
        address retailer; // Address of the retailer who sold the product
        address customer; // Address of the customer who owns the product
    }

    // Define some events
    event ProductProduced(uint256 productID);
    event ChangedOnSale(uint256 productID, address owner);
    event ProductPurchased(uint256 productID, address oldOwner, address newOwner);
    event ProductShipped(uint256 productID, address sender, address receiver);
    event ProductReceived(uint productID);

    function produceProduct(uint256 _productID, uint256 _productUID) public onlyManufacturer {
        Product memory newProduct; // Define a new product in memory
        newProduct.productID = _productID; // Define the ID of the product
        newProduct.productUID = _productUID; // Define the UID of the product
        newProduct.currentOwner = _msgSender(); // Define the initial owner as the manufacturer who produced the product
        newProduct.previousOwner = _msgSender(); // Define the previous owner as the first one (default when the product is first produced)
        newProduct.creationDate = block.timestamp; // Assign the date of creation of the product
        newProduct.productStage = defaultProductStage; // Assign the initial default stage to the product
        newProduct.productStatus = defaultProductStatus; // Assign the initial default stage to the product

        // Create some placeholders for empty fields
        address distributor;
        address retailer;
        address customer;

        newProduct.manufacturer = _msgSender(); // Define the manufacturer address with the address of produced the product
        newProduct.distributor = distributor; // Define a placeholder for the distributor (defined later in the supply chain)
        newProduct.retailer = retailer; // Define a placeholder for the retailer (defined later in the supply chain)
        newProduct.customer = customer; // Define a placeholder for the customer (defined later in the supply chain)

        // Add a new product to the product list
        products[_productID] = newProduct;

        // Emit the event related to the production of the product
        emit ProductProduced(_productID);
    }

    // Function to check that entity is allowed to ship the product
    function checkOldOwnerAndStatus(uint256 _productID) internal view {
        require(
            (products[_productID].productStatus == ProductStatus.InFactory && products[_productID].oldOwner == products[_productID].manufacturer) ||
            (products[_productID].productStatus == ProductStatus.InDistributor && products[_productID].oldOwner == products[_productID].distributor) ||
            (products[_productID].productStatus == ProductStatus.InRetailer && products[_productID].oldOwner == products[_productID].retailer),
            "Invalid old owner or status for shipping"
        );
    }

    function changeOnSale(uint _productID) public onlyManufacturer onlyDistributor onlyRetailer {
        require(products[_productID].currentOwner == _msgSender(), "Only the current owner can change the product stage to OnSale");
        require(
            products[_productID].productStage != ProductStage.Purchased && 
            products[_productID].productStage != ProductStage.Shipped,
            "Product must not be in Purchased or Shipped stage to change to OnSale"
        );
        products[_productID].productStage = ProductStage.OnSale; // Flag the item onSale

        emit ChangedOnSale(_productID, _msgSender());
    }

    function purchaseProduct(uint _productID) public onlyDistributor onlyRetailer onlyCustomer {
        require(products[_productID].currentOwner != _msgSender(), "Current owners can't buy their own products");
        require(products[_productID].productStage == ProductStage.OnSale, "Product must be On Sale to be purchased");
        products[_productID].productStage = ProductStage.Purchased; // Flag the item "Purchased"
        products[_productID].oldOwner = products[_productID].currentOwner; // Store the old owner before updating
        products[_productID].currentOwner = _msgSender(); // Updated the owner

        emit ProductPurchased(_productID, products[_productID].oldOwner, _msgSender());
    }

    function shipProduct(uint _productID, address receiver) public onlyManufacturer onlyDistributor onlyRetailer {
        require(products[_productID].currentOwner != _msgSender(), "Current owners can't ship the product to themselves");
        require(products[_productID].productStage == ProductStage.OnSale, "Product must be purchased by some entity to be shipped");
        checkOldOwnerAndStatus(_productID); // Call the internal function to check old owner and status
        products[_productID].productStage = ProductStage.Shipped; // Flag the item stage "Shipped"
        products[_productID].productStatus = ProductStatus.Shipping; // Flag the item status to "Shipping"

        emit ProductShipped(_productID, _msgSender(), receiver);
    }

    function receiveProduct(uint _productID) public onlyDistributor onlyRetailer onlyCustomer {
        require(products[_productID].productStage == ProductStage.Shipped, "Product must be in 'Shipped' stage to be received");
        require(products[_productID].productStatus == ProductStatus.Shipping, "Product must be in 'Shipping' status to be received");
        require(products[_productID].currentOwner == _msgSender(), "Only the current owner can receive the product");
        products[_productID].productStage = ProductStage.Received; // Flag the item stage "Received"
        
        // Determine the correct status based on the current owner
        if (_msgSender() == products[_productID].distributor) {
            products[_productID].productStatus = ProductStatus.InDistributor;
        } else if (_msgSender() == products[_productID].retailer) {
            products[_productID].productStatus = ProductStatus.InRetailer;
        } else if (_msgSender() == products[_productID].customer) {
            products[_productID].productStatus = ProductStatus.InCustomer;
        } else {
            // Handle unexpected cases or revert if necessary
            revert("Invalid current owner for updating status");
        }

        emit ProductReceived(_productID);
    }


}