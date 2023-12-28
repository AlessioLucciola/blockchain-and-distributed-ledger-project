// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./Entities.sol";

contract SmartSupply is Entities {
    // Define the unique id of a product and its universal id
    // productID is used to classify each product tracked on SmartSupply
    // productUID is used to classify the same products
    // e.g. If we have two pair of shoes of the same model, the have a different productID but the same productUID 
    uint256 productID;
    uint256 productUID;

    // Define a mapping that maps each productID to its corresponding struct
    mapping(uint256 => Product) public products;

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

    // Define some modifiers
    modifier onlyBusinessActivities() {
        require(manufacturers[msg.sender] || distributors[msg.sender] || retailers[msg.sender], "Only manufacturers, distributors or retailers can perform this action");
        _;
    }

    modifier onlyReceivers() {
        require(customers[msg.sender] || distributors[msg.sender] || retailers[msg.sender], "Only customers, distributors or retailers can perform this action");
        _;
    }

    function produceProduct(uint256 _productID, uint256 _productUID) external onlyManufacturer {
        Product memory newProduct; // Define a new product in memory
        newProduct.productID = _productID; // Define the ID of the product
        newProduct.productUID = _productUID; // Define the UID of the product
        newProduct.currentOwner = msg.sender; // Define the initial owner as the manufacturer who produced the product
        newProduct.previousOwner = msg.sender; // Define the previous owner as the first one (default when the product is first produced)
        newProduct.creationDate = block.timestamp; // Assign the date of creation of the product
        newProduct.productStage = defaultProductStage; // Assign the initial default stage to the product
        newProduct.productStatus = defaultProductStatus; // Assign the initial default stage to the product

        // Create some placeholders for empty fields
        address distributor;
        address retailer;
        address customer;

        newProduct.manufacturer = msg.sender; // Define the manufacturer address with the address of produced the product
        newProduct.distributor = distributor; // Define a placeholder for the distributor (defined later in the supply chain)
        newProduct.retailer = retailer; // Define a placeholder for the retailer (defined later in the supply chain)
        newProduct.customer = customer; // Define a placeholder for the customer (defined later in the supply chain)

        // Add a new product to the product list
        products[_productID] = newProduct;

        // Emit the event related to the production of the product
        emit ProductProduced(_productID);
    }

    // Function to check that entity is allowed to ship the product
    function checkOldOwnerAndStatus(uint256 _productID, address _oldOwner, address _receiver) internal view {
        require(_receiver != _oldOwner, "Product cannot be shipped to the same address as the old owner"); // Ensure that the product is not shipped to the same address as the old owner
        require(products[_productID].currentOwner == _receiver, "Product must be shipped to the current owner"); // Ensure that the product is being shipped to the current owner
        require(
            // Check that the entity calling the function is the old owner
            _oldOwner == products[_productID].previousOwner &&
            (
                // Check that the product is in the correct status based on the old owner
                (_oldOwner == products[_productID].manufacturer && products[_productID].productStatus == ProductStatus.InFactory) ||
                (_oldOwner == products[_productID].distributor && products[_productID].productStatus == ProductStatus.InDistributor) ||
                (_oldOwner == products[_productID].retailer && products[_productID].productStatus == ProductStatus.InRetailer)
            ),
            "Invalid old owner or status for shipping"
        );
    }

    function changeOnSale(uint _productID) external onlyBusinessActivities {
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can change the product stage to OnSale");
        require(
            products[_productID].productStage != ProductStage.Purchased && 
            products[_productID].productStage != ProductStage.Shipped,
            "Product must not be in Purchased or Shipped stage to change to OnSale"
        );
        products[_productID].productStage = ProductStage.OnSale; // Flag the item onSale

        emit ChangedOnSale(_productID, msg.sender);
    }

    function purchaseProduct(uint _productID) external onlyReceivers {
        require(products[_productID].currentOwner != msg.sender, "Current owners can't buy their own products");
        require(products[_productID].productStage == ProductStage.OnSale, "Product must be On Sale to be purchased");
        products[_productID].productStage = ProductStage.Purchased; // Flag the item "Purchased"
        products[_productID].previousOwner = products[_productID].currentOwner; // Store the old owner before updating
        products[_productID].currentOwner = msg.sender; // Updated the owner

        // Determine the role of the purchasing entity
        if (distributors[msg.sender]) {
            // If the purchasing entity is a manufacturer, update the distributor field
            products[_productID].distributor = msg.sender;
        } else if (retailers[msg.sender]) {
            // If the purchasing entity is a distributor, update the retailer field
            products[_productID].retailer = msg.sender;
        } else if (customers[msg.sender]) {
            // If the purchasing entity is a retailer, update the customer field
            products[_productID].customer = msg.sender;
        } else {
            // Handle unexpected cases or revert if necessary
            revert("Invalid role for updating product information");
        }

        emit ProductPurchased(_productID, products[_productID].previousOwner, msg.sender);
    }

    function shipProduct(uint _productID, address receiver) external onlyBusinessActivities {
        require(products[_productID].productStage == ProductStage.Purchased, "Product must be purchased by some entity to be shipped");
        require(msg.sender == products[_productID].previousOwner, "Product can only be shipped by the old owner"); // Ensure that the product is not shipped by another identity
        checkOldOwnerAndStatus(_productID, msg.sender, receiver); // Call the internal function to check old owner and product location
        products[_productID].productStage = ProductStage.Shipped; // Flag the item stage "Shipped"
        products[_productID].productStatus = ProductStatus.Shipping; // Flag the item location to "Shipping"

        emit ProductShipped(_productID, msg.sender, receiver);
    }

    function receiveProduct(uint _productID) external onlyReceivers {
        require(products[_productID].productStage == ProductStage.Shipped, "Product must be in 'Shipped' stage to be received");
        require(products[_productID].productStatus == ProductStatus.Shipping, "Product must be in 'Shipping' status to be received");
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can receive the product");
        products[_productID].productStage = ProductStage.Received; // Flag the item stage "Received"
        
        // Determine the correct location based on the current owner
        if (msg.sender == products[_productID].distributor) {
            products[_productID].productStatus = ProductStatus.InDistributor;
        } else if (msg.sender == products[_productID].retailer) {
            products[_productID].productStatus = ProductStatus.InRetailer;
        } else if (msg.sender == products[_productID].customer) {
            products[_productID].productStatus = ProductStatus.InCustomer;
        } else {
            // Handle unexpected cases or revert if necessary
            revert("Invalid current owner for updating status");
        }

        emit ProductReceived(_productID);
    }
}