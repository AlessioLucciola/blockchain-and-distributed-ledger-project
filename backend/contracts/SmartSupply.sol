// SPDX-License-Identifier: UNLICENSED
    
pragma solidity >=0.8.0 <0.9.0;

import "./Entities.sol";
import "./Utils.sol";

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

    function purchaseProduct(uint _productID) external payable onlyReceivers {
        require(products[_productID].currentOwner != msg.sender, "Current owners can't buy their own products");
        require(products[_productID].productStage == ProductStage.OnSale, "Product must be On Sale to be purchased");

        // Check if the buyer is a customer
        bool isCustomer = customers[msg.sender];

        if (isCustomer) {
            uint256 certificationPrice = 100 wei;
            require(msg.value >= certificationPrice, "Customers must send the correct amount of coins to buy the product certification");
            smartSupplyBalance += msg.value; //Transfer the amount of coins to SmartSupply balance
            emit FundsAdded(msg.sender, msg.value);
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

        emit ProductPurchased(_productID, products[_productID].previousOwner, msg.sender);
    }

    function shipProduct(uint _productID, address receiver) external onlyBusinessActivities {
        require(products[_productID].productStage == ProductStage.Purchased, "Product must be purchased by some entity to be shipped");
        require(msg.sender == products[_productID].previousOwner, "Product can only be shipped by the old owner"); // Ensure that the product is not shipped by another identity
        checkOldOwnerAndLocation(_productID, msg.sender, receiver); // Call the internal function to check old owner and product location
        products[_productID].productStage = ProductStage.Shipped; // Flag the item stage "Shipped"
        products[_productID].productLocation = ProductLocation.Shipping; // Flag the item location to "Shipping"

        // If the receiver is a customer, distribute payments to the manufacturer, distributor, and retailer
        if (customers[receiver]) {
            // Distribute payments only if TransactionIDs are not null
            distributeReward(payable(products[_productID].ownerships.manufacturer), 0, 25 wei); //0 because manufacturer don't have to make any external payments
            distributeReward(payable(products[_productID].ownerships.distributor), products[_productID].transactionIDs.distributorBankTransactionID, 25 wei);
            distributeReward(payable(products[_productID].ownerships.retailer), products[_productID].transactionIDs.retailerBankTransactionID, 25 wei);
        }

        emit ProductShipped(_productID, msg.sender, receiver);
    }

    function receiveProduct(uint _productID) external onlyReceivers {
        require(products[_productID].productStage == ProductStage.Shipped, "Product must be in 'Shipped' stage to be received");
        require(products[_productID].productLocation == ProductLocation.Shipping, "Product must be in 'Shipping' location to be received");
        require(products[_productID].currentOwner == msg.sender, "Only the current owner can receive the product");
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

        emit ProductReceived(_productID, msg.sender);
    }

    function distributeReward(address payable recipient, uint256 _productID, uint256 amount) internal {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Invalid payment amount");

        // Check if the recipient is a retailer and has a non-null retailerBankTransactionID
        if (retailers[recipient]) {
            if (products[_productID].transactionIDs.retailerBankTransactionID > 0) {
                recipient.transfer(amount);
                products[_productID].rewards.retailerRewarded = true;
                emit RewardGiven(recipient, amount);
            }
        }
        // Check if the recipient is a distributor and has a non-null distributorBankTransactionID
        else if (distributors[recipient]) {
            if (products[_productID].transactionIDs.distributorBankTransactionID > 0) {
                recipient.transfer(amount);
                products[_productID].rewards.distributorRewarded = true;
                emit RewardGiven(recipient, amount);
            }
        }
        // Always give the money to the manufacturer
        else if (manufacturers[recipient]) {
            recipient.transfer(amount);
            products[_productID].rewards.manufacturerRewarded = true;
            emit RewardGiven(recipient, amount);
        } else {
            revert("Invalid recipient role or missing transactionID");
        }
    }

    function changeBankTransactionID(uint _productID, uint256 _newTransactionID) external {
        //require(products[_productID].productStage == ProductStage.Purchased, "Product must be purchased to change bank transaction ID");

        if (customers[msg.sender] && msg.sender == products[_productID].ownerships.customer) {
            // Only the customer that bought the product can change customerBankTransactionID
            //products[_productID].transactionIDs.customerBankTransactionID = _newTransactionID;
        } else if (distributors[msg.sender] && msg.sender == products[_productID].ownerships.distributor) {
            // Only the distributor that bought the product can change distributorBankTransactionID
            products[_productID].transactionIDs.distributorBankTransactionID = _newTransactionID;
        } else if (retailers[msg.sender] && msg.sender == products[_productID].ownerships.retailer) {
            // Only the retailer that bought the product can change retailerBankTransactionID
            products[_productID].transactionIDs.retailerBankTransactionID = _newTransactionID;
        } else {
            revert("Caller does not have the right to change bank transaction ID");
        }

        if (distributors[msg.sender] && msg.sender == products[_productID].ownerships.distributor && !products[_productID].rewards.distributorRewarded) {
            // Send the reward to the distributor
            distributeReward(payable(msg.sender), _productID, 25 wei);
            products[_productID].rewards.distributorRewarded = true;
        } else if (retailers[msg.sender] && msg.sender == products[_productID].ownerships.retailer && !products[_productID].rewards.retailerRewarded) {
            // Send the reward to the retailer
            distributeReward(payable(msg.sender), _productID, 25 wei);
            products[_productID].rewards.retailerRewarded = true;
        }

        emit BankTransactionChanged(_productID, msg.sender);
    }

    // address payable [] public recipients;
    // event TransferReceived(address _from, uint _amount);

    // constructor (address payable [] memory _recipients){
    //     for (uint i = 0; i < _recipients.length; i++){ // loop through all the recipients and add them to the array
    //         recipients.push(_recipients[i]);
    //     }
    // }

    // receive() payable external { // receive function to receive ether 
    //     uint256 amount = msg.value / recipients.length; // divide the amount of ether by the number of recipients
    //     for (uint i = 0; i < recipients.length; i++){ // loop through all the recipients and send them the amount of ether
    //         recipients[i].transfer(amount);
    //     }
    //     emit TransferReceived(msg.sender, msg.value); // emit an event to notify the frontend that ether has been received
    // }

    string public status;
    function getStatus() external {
        status = "Payed";
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}
