// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./BalanceManager.sol";

contract Entities is BalanceManager {
    // Define a set of mappings to check the role of an address
    mapping(address => bool) public manufacturers;
    mapping(address => bool) public distributors;
    mapping(address => bool) public retailers;
    mapping(address => bool) public customers;

    // Define a set of mappings to manage the verification process
    mapping(address => bool) public entityVerificationPermission;
    mapping(address => bool) public verificationStatus;

    // Define a set of events triggered when adding/removing an entity
    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);
    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);
    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);
    event CustomerAdded(address indexed account);
    event CustomerRemoved(address indexed account);
    event VerificationPermissionGranted(address indexed account);
    event VerificationPermissionRevoked(address indexed account);
    event EntityVerified(address indexed account);
    event EntityVerificationRemoved(address indexed account);

    // Modifier function to allow other functions to be executed only by manufacturers or the admin
    modifier onlyManufacturer() {
        require(manufacturers[msg.sender] || msg.sender == admin, "Only manufacturers or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by distributors or the admin
    modifier onlyDistributor() {
        require(distributors[msg.sender] || msg.sender == admin, "Only distributors or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by retailers or the admin
    modifier onlyRetailer() {
        require(retailers[msg.sender] || msg.sender == admin, "Only retailers or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by customers or the admin
    modifier onlyCustomer() {
        require(customers[msg.sender] || msg.sender == admin, "Only customers or the admin can perform this action");
        _;
    }

    // Modifier function that check if the entity has sent the required proof to get the verified badge
    modifier onlyVerificationPermittedEntity() {
        require(entityVerificationPermission[msg.sender], "Entity hasn't given its identification proof yet");
        require(!customers[msg.sender], "Customers are not allowed to perform this action");
        _;
    }

    // Modifier function that check if the entity is a manufacturer, distributor or retailer
    modifier onlyBusinessActivities() {
        require(manufacturers[msg.sender] || distributors[msg.sender] || retailers[msg.sender], "Only manufacturers, distributors or retailers can perform this action");
        _;
    }

    // Modifier function that check if the entity is a customer, distributor or retailer
    modifier onlyReceivers() {
        require(customers[msg.sender] || distributors[msg.sender] || retailers[msg.sender], "Only customers, distributors or retailers can perform this action");
        _;
    }

    // Define a function to check if the account is a Manufacturer
    function isManufacturer(address account) public view returns (bool) {
        return manufacturers[account];
    }

    // Define a function to add a new Manufacturer
    function addManufacturer() external {
        manufacturers[msg.sender] = true;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit ManufacturerAdded(msg.sender);
    }

    // Define a function to remove a Manufacturer
    function removeManufacturer() external onlyManufacturer {
        manufacturers[msg.sender] = false;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit ManufacturerRemoved(msg.sender);
    }

    // Define a function to check if the account is a Distributor
    function isDistributor(address account) public view returns (bool) {
        return distributors[account];
    }

    // Define a function to add a new Distibutor
    function addDistributor() external {
        distributors[msg.sender] = true;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit DistributorAdded(msg.sender);
    }

    // Define a function to remove a Distributor
    function removeDistributor() external onlyDistributor {
        distributors[msg.sender] = false;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit DistributorRemoved(msg.sender);
    }

    // Define a function to check if the account is a Retailer
    function isRetailer(address account) public view returns (bool) {
        return retailers[account];
    }

    // Define a function to add a new Retailer
    function addRetailer() external {
        retailers[msg.sender] = true;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit RetailerAdded(msg.sender);
    }

    // Define a function to remove a Retailer
    function removeRetailer() external onlyRetailer {
        retailers[msg.sender] = false;
        entityVerificationPermission[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit RetailerRemoved(msg.sender);
    }

    // Define a function to check if the account is a Customer
    function isCustomer(address account) public view returns (bool) {
        return customers[account];
    }

    // Define a function to add a new Customer
    function addCustomer() external {
        customers[msg.sender] = true;
        emit CustomerAdded(msg.sender);
    }

    // Define a function to remove a Customer
    function removeCustomer() external onlyCustomer {
        customers[msg.sender] = false;
        emit CustomerRemoved(msg.sender);
    }

    // Define a function to check if the account sent the identification proof and it was accepted by an admin
    function isVerificationPermitted(address account) public view returns (bool) {
        return entityVerificationPermission[account];
    }

    // Allow admin to grant permission for an entity to trigger verification
    function grantVerificationPermission(address account) external onlyAdmin {
        entityVerificationPermission[account] = true;

        emit VerificationPermissionGranted(account);
    }

    // Allow admin to revoke permission for an entity to trigger verification
    function revokeVerificationPermission(address account) external onlyAdmin {
        entityVerificationPermission[account] = false;

        emit VerificationPermissionRevoked(account);
    }

    // Define a function to check if the account is verified
    function isVerified(address account) public view returns (bool) {
        return verificationStatus[account];
    }

    // Define a function to make the payment and receive the verified badge (only for entities that sent a proof and it was accepted by the admin)
    function verifyEntity() external payable onlyVerificationPermittedEntity {
        BalanceManager balanceManager = new BalanceManager();
        uint256 verificationAmount = balanceManager.getVerificationAmount(); // Get the verification amount from the BalanceManager contract
        require(msg.value >= verificationAmount, "Insufficient payment for verification"); // Ensure the amount sent is greater than the verification amount
        uint256 amountSent = msg.value;
        smartSupplyBalance += amountSent; // Add the amount sent to the SmartSupply balance
        emit FundsAdded(msg.sender, amountSent); // Emit an event to notify the addition of funds

        verificationStatus[msg.sender] = true; // Mark the entity as verified
        emit EntityVerified(msg.sender); // Emit an event to notify the verification
    }

    // Define a function to force the removal of the verification (can be done only by the admin)
    function removeVerification(address account) external onlyAdmin {
        require(verificationStatus[account], "Entity is already not verified");
        verificationStatus[account] = false; // Mark the entity as not verified

        emit EntityVerificationRemoved(account); // Emit an event to notify the removal of the verification
    }

    function addEntities(address manufacturer, address distributor, address retailer, address customer) external onlyAdmin {
        manufacturers[manufacturer] = true;
        distributors[distributor] = true;
        retailers[retailer] = true;
        customers[customer] = true;
        entityVerificationPermission[manufacturer] = false;
        entityVerificationPermission[distributor] = false;
        entityVerificationPermission[retailer] = false;
        verificationStatus[manufacturer] = false;
        verificationStatus[distributor] = false;
        verificationStatus[retailer] = false;
        emit ManufacturerAdded(manufacturer);
        emit DistributorAdded(distributor);
        emit RetailerAdded(retailer);
        emit CustomerAdded(customer);
    }
}