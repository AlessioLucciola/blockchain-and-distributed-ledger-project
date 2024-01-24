// SPDX-License-Identifier: UNLICENSED
    
pragma solidity >=0.8.0 <0.9.0;

import "./Entities.sol";
import "./Utils.sol";
import "hardhat/console.sol";

contract SmartSupply is Entities, Utils {
    // Define a mapping that maps each productID to its corresponding struct
    mapping(uint256 => Product) public products;

    function produceProduct(uint256 _productID, uint256 _productUID) external onlyManufacturer {
        Product memory newProduct; // Define a new product in memory
        newProduct.productID = _productID; // Define the ID of the product
        newProduct.productUID = _productUID; // Define the UID of the product
        newProduct.currentOwner = msg.sender; // Define the initial owner as the manufacturer who produced the product
        newProduct.previousOwner = msg.sender; // Define the previous owner as the first one (default when the product is first produced)
        newProduct.creationDate = block.timestamp; // Assign the date of creation of the product
        newProduct.certificationPrice = 0 gwei; // Assign the certification price to the product
        newProduct.productStage = defaultProductStage; // Assign the initial default stage to the product
        newProduct.productLocation = defaultProductLocation; // Assign the initial default stage to the product

        // Create a new Roles struct with placeholders for empty fields
        Ownerships memory ownerships;
        ownerships.manufacturer = msg.sender;
        // No need to assign distributor, retailer, and customer initially; they will be updated later in the supply chain
        newProduct.ownerships = ownerships;

        // Add a new product to the product list
        products[_productID] = newProduct;

        // Emit the event related to the production of the product
        emit ProductProduced(_productID, msg.sender);
    }

    // Function to check that entity is allowed to ship the product
    function checkOldOwnerAndLocation(uint256 _productID, address _oldOwner, address _receiver) internal view {
        require(_receiver != _oldOwner, "Product cannot be shipped to the same address as the old owner"); // Ensure that the product is not shipped to the same address as the old owner
        require(products[_productID].currentOwner == _receiver, "Product must be shipped to the current owner"); // Ensure that the product is being shipped to the current owner
        require(
            // Check that the entity calling the function is the old owner
            _oldOwner == products[_productID].previousOwner &&
            (
                // Check that the product is in the correct location based on the old owner
                (_oldOwner == products[_productID].ownerships.manufacturer && products[_productID].productLocation == ProductLocation.InFactory) ||
                (_oldOwner == products[_productID].ownerships.distributor && products[_productID].productLocation == ProductLocation.InDistributor) ||
                (_oldOwner == products[_productID].ownerships.retailer && products[_productID].productLocation == ProductLocation.InRetailer)
            ),
            "Invalid old owner or location for shipping"
        );
    }

    // Function to change the certification price of a product (only executable by business activities - not customers)
    function changeOnSale(uint _productID) external onlyBusinessActivities {
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can change the product stage to OnSale"); // Ensure that the product is not flagged on sale by another identity
        require(!retailers[msg.sender], "To flag the product onSale use the changeOnSaleRetailer function instead"); // Ensure that the product is not flagged on sale by a retailer (that must use another function instead)
        // Ensure that the product is not in the Purchased or Shipped stage
        require(
            products[_productID].productStage != ProductStage.Purchased && 
            products[_productID].productStage != ProductStage.Shipped,
            "Product must not be in Purchased or Shipped stage to change to OnSale"
        );
        products[_productID].productStage = ProductStage.OnSale; // Flag the item onSale

        emit ChangedOnSale(_productID, msg.sender); // Emit the event
    }

    // Function to change the certificationPrice of a product (only executable by retailers)
    function changeOnSaleRetailer(uint256 _productID, uint256 _newCertificationPrice) external onlyBusinessActivities {
        require(retailers[msg.sender], "Only retailers can change the certification price"); // Ensure that the product is flagged on sale by a retailer
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can change the certification price"); // Ensure that the product is not flagged on sale by another identity
        // Ensure that the product is not in the Purchased or Shipped stage
        require(
            products[_productID].productStage != ProductStage.Purchased && 
            products[_productID].productStage != ProductStage.Shipped,
            "Product must not be in Purchased or Shipped stage to change to OnSale"
        );

        products[_productID].productStage = ProductStage.OnSale; // Flag the item onSale
        products[_productID].certificationPrice = _newCertificationPrice; // Update the certification price of the product
        
        emit ChangedOnSaleRetailer(_productID, msg.sender, _newCertificationPrice); // Emit the event
    }

    // Function to change the product stage to notOnSale (only executable by business activities - not customers)
    function changeNotOnSale(uint _productID) external onlyBusinessActivities {
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can change the product stage to NotOnSale"); // Ensure that the product is not flagged on sale by another identity
        // Ensure that the product is not in the Purchased or Shipped stage
        require(
            products[_productID].productStage != ProductStage.Purchased && 
            products[_productID].productStage != ProductStage.Shipped,
            "Product must not be in Purchased or Shipped stage to change to NotOnSale"
        );
        products[_productID].productStage = ProductStage.NotOnSale; // Flag the item notOnSale

        emit ChangedNotOnSale(_productID, msg.sender); // Emit the event
    }

    // Function to purchase a product (only executable by receives - not manufacturers)
    function purchaseProduct(uint _productID) external payable onlyReceivers {
        require(products[_productID].currentOwner != msg.sender, "Current owners can't buy their own products"); // Ensure that the product is not purchased by the current owner
        require(products[_productID].productStage == ProductStage.OnSale, "Product must be On Sale to be purchased"); // Ensure that the product is flagged on sale

        // Check if the buyer is a customer
        bool isCustomer = customers[msg.sender];

        // If the buyer is a customer, they must pay for the certification price (otherwise it is just a transfer of ownership)
        if (isCustomer) {
            require(msg.value >= products[_productID].certificationPrice, "Insufficient funds to purchase the product"); // Ensure that the customer has enough funds to purchase the certification
            smartSupplyBalance += msg.value; //Transfer the amount of coins to SmartSupply balance
            emit FundsAdded(msg.sender, msg.value); // Emit an event to notify the addition of funds
        }

        products[_productID].productStage = ProductStage.Purchased; // Flag the item "Purchased"
        products[_productID].previousOwner = products[_productID].currentOwner; // Store the old owner before updating
        products[_productID].currentOwner = msg.sender; // Updated the owner

        // Determine the role of the purchasing entity
        if (distributors[msg.sender]) {
            // If the purchasing entity is a manufacturer, update the distributor field
            products[_productID].ownerships.distributor = msg.sender;
        } else if (retailers[msg.sender]) {
            // If the purchasing entity is a distributor, update the retailer field
            products[_productID].ownerships.retailer = msg.sender;
        } else if (customers[msg.sender]) {
            // If the purchasing entity is a retailer, update the customer field
            products[_productID].ownerships.customer = msg.sender;
        } else {
            // Handle unexpected cases or revert if necessary
            revert("Invalid role for updating product information");
        }

        emit ProductPurchased(_productID, products[_productID].previousOwner, msg.sender); // Emit the event
    }

    // Function to divide two numbers and round up the result
    function divisionRoundUp(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = (x + (y / 2) / y);
    }

    // Function to ship a product (only executable by business activities - not customers)
    function shipProduct(uint _productID, address receiver) external onlyBusinessActivities {
        require(products[_productID].productStage == ProductStage.Purchased, "Product must be purchased by some entity to be shipped"); // Ensure that the product is purchased by some entity
        require(msg.sender == products[_productID].previousOwner, "Product can only be shipped by the old owner"); // Ensure that the product is not shipped by another identity
        checkOldOwnerAndLocation(_productID, msg.sender, receiver); // Call the internal function to check old owner and product location
        products[_productID].productStage = ProductStage.Shipped; // Flag the item stage "Shipped"
        products[_productID].productLocation = ProductLocation.Shipping; // Flag the item location to "Shipping"

        // If the receiver is a customer, distribute payments to the manufacturer, distributor, and retailer
        if (retailers[msg.sender]) {
            uint256 reward = divisionRoundUp(products[_productID].certificationPrice, 4); // 25% of the certification price

            // Distribute payments only if TransactionIDs are not null
            distributeReward(payable(products[_productID].ownerships.manufacturer), _productID, reward); //0 because manufacturer doesn't have to make any external payments
            distributeReward(payable(products[_productID].ownerships.distributor), _productID, reward);
            distributeReward(payable(products[_productID].ownerships.retailer), _productID, reward);
        }

        emit ProductShipped(_productID, msg.sender, receiver); // Emit the event
    }

    // Function to receive a product (only executable by receives - not manufacturers)
    function receiveProduct(uint _productID) external onlyReceivers {
        require(products[_productID].productStage == ProductStage.Shipped, "Product must be in 'Shipped' stage to be received"); // Ensure that the product is in the "Shipped" stage
        require(products[_productID].productLocation == ProductLocation.Shipping, "Product must be in 'Shipping' location to be received"); // Ensure that the product is in the "Shipping" location
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can receive the product"); // Ensure that the product is not received by another identity but the current owner
        products[_productID].productStage = ProductStage.Received; // Flag the item stage "Received"
        
        // Determine the correct location based on the current owner
        if (msg.sender == products[_productID].ownerships.distributor) {
            products[_productID].productLocation = ProductLocation.InDistributor;
        } else if (msg.sender == products[_productID].ownerships.retailer) {
            products[_productID].productLocation = ProductLocation.InRetailer;
        } else if (msg.sender == products[_productID].ownerships.customer) {
            products[_productID].productLocation = ProductLocation.InCustomer;
        } else {
            // Handle unexpected cases or revert if necessary
            revert("Invalid current owner for updating location");
        }

        emit ProductReceived(_productID, msg.sender); // Emit the event
    }

    // Function to distribute rewards to the manufacturer, distributor, and retailer
    function distributeReward(address payable recipient, uint _productID, uint256 amount) internal {
        require(recipient != address(0), "Invalid recipient address"); // Ensure that the recipient address is not null
        require(amount > 0, "Invalid payment amount"); // Ensure that the amount is greater than 0

        // Check if the recipient is a retailer and has a non-null retailerBankTransactionID
        if (manufacturers[recipient]) {
            recipient.transfer(amount);
            products[_productID].rewards.manufacturerRewarded = true;
            emit RewardGiven(recipient, amount);
        }
        // Check if the recipient is a distributor and has a non-null distributorBankTransactionID
        else if (distributors[recipient] && products[_productID].transactionIDs.distributorBankTransactionID > 0) {
            recipient.transfer(amount);
            products[_productID].rewards.distributorRewarded = true;
            emit RewardGiven(recipient, amount);
        }
        // Always give the money to the manufacturer
        else if (retailers[recipient] && products[_productID].transactionIDs.retailerBankTransactionID > 0) {
            recipient.transfer(amount);
            products[_productID].rewards.retailerRewarded = true;
            emit RewardGiven(recipient, amount);
        }
    }

    // Function to change the bank transaction ID (only executable by distributors and retailers)
    function changeBankTransactionID(uint _productID, uint256 _newTransactionID) external {
        address customerAddress = products[_productID].ownerships.customer;
        address distributorAddress = products[_productID].ownerships.distributor;
        address retailerAddress = products[_productID].ownerships.retailer;

        // Check if the caller is a distributor or retailer
        if (distributors[msg.sender] && msg.sender == distributorAddress) {
            // Only the distributor that bought the product can change distributorBankTransactionID
            products[_productID].transactionIDs.distributorBankTransactionID = _newTransactionID;
        } else if (retailers[msg.sender] && msg.sender == retailerAddress) {
            // Only the retailer that bought the product can change retailerBankTransactionID
            products[_productID].transactionIDs.retailerBankTransactionID = _newTransactionID;
        } else {
            revert("Caller does not have the right to change bank transaction ID");
        }

        uint256 reward = divisionRoundUp(products[_productID].certificationPrice, 4); // 25% of the certification price

        // Check if distributor or retailer rewards need to be distributed (product already shipped by retailer and reward not already given to the entity)
        if (distributors[msg.sender] && msg.sender == distributorAddress && !products[_productID].rewards.distributorRewarded && (customerAddress != address(0) && (products[_productID].productStage == ProductStage.Shipped || products[_productID].productStage == ProductStage.Received))) {
            // Send the reward to the distributor
            distributeReward(payable(msg.sender), _productID, reward);
        } else if (retailers[msg.sender] && msg.sender == retailerAddress && !products[_productID].rewards.retailerRewarded && (customerAddress != address(0) && (products[_productID].productStage == ProductStage.Shipped || products[_productID].productStage == ProductStage.Received))) {
            // Send the reward to the retailer
            distributeReward(payable(msg.sender), _productID, reward);
        }

        emit BankTransactionChanged(_productID, msg.sender); // Emit the event
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}
