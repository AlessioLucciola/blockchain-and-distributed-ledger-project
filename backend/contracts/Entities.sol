// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract Roles {
    address admin;

    // Define a set of mappings to check the role of an address
    mapping(address => bool) public manufacturers;
    mapping(address => bool) public distributors;
    mapping(address => bool) public retailers;
    mapping(address => bool) public customers;
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

    // Modifier function to allow other functions to be executed only by admins
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by manufacturers
    modifier onlyManufacturerAdmin() {
        require(manufacturers[msg.sender] || msg.sender == admin, "Only manufacturers or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by distributors
    modifier onlyDistributorAdmin() {
        require(distributors[msg.sender] || msg.sender == admin, "Only distributors or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed only by retailers
    modifier onlyRetailerAdmin() {
        require(retailers[msg.sender] || msg.sender == admin, "Only retailers or the admin can perform this action");
        _;
    }

    // Modifier function to allow other functions to be executed if the account is verified
    modifier onlyVerified(address account) {
        require(msg.sender == admin, "Only an admin can force the verification removal");
        require(verificationStatus[account], "Entity is not yet verified");
        _;
    }

    // Define the admin role as the sender of the message
    constructor() {
        admin = msg.sender;
    }

    // Define a function to check if the account is a Manufacturer
    function isManufacturer(address account) public view returns (bool) {
        return manufacturers[account];
    }

    // Define a function to add a new Manufacturer
    function addManufacturer() external {
        manufacturers[msg.sender] = true;
        verificationStatus[msg.sender] = false;
        emit ManufacturerAdded(msg.sender);
    }

    // Define a function to remove a Manufacturer
    function removeManufacturer() external onlyManufacturerAdmin {
        manufacturers[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit ManufacturerRemoved(msg.sender);
    }

    // Define a function to check if the account is a Distributor
    function isDistributor(address account) public view returns (bool) {
        return distributors[account];
    }

    // Define a function to add a new Distibutor
    function addDistributors() external {
        distributors[msg.sender] = true;
        verificationStatus[msg.sender] = false;
        emit DistributorAdded(msg.sender);
    }

    // Define a function to remove a Distributor
    function removeDistributor() external onlyDistributorAdmin {
        distributors[msg.sender] = false;
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
        verificationStatus[msg.sender] = false;
        emit RetailerAdded(msg.sender);
    }

    // Define a function to remove a Retailer
    function removeRetailer() external onlyRetailerAdmin {
        retailers[msg.sender] = false;
        verificationStatus[msg.sender] = false;
        emit RetailerRemoved(msg.sender);
    }

    // Define a function to check if the account is a Customer
    function isCustomer(address account) public view returns (bool) {
        return customers[account];
    }

    // Define a function to add a new Customer
    function addCustomers() external {
        retailers[msg.sender] = true;
        emit RetailerAdded(msg.sender);
    }

    // Define a function to remove a Customer
    function removeCustomer() external onlyCustomerAdmin {
        customers[msg.sender] = false;
        emit CustomerRemoved(msg.sender);
    }

    function verifyEntity() external payable onlyAdmin {
        // Ensure a certain amount of Ether is sent for verification
        require(msg.value >= 0.2 ether, "Insufficient payment for verification");

        // Mark the entity as verified
        verificationStatus[msg.sender] = true;
    }

    // Define a function to force the removal of the verification (can be done only by the admin)
    function removeVerification(address account) external onlyVerified {
        verificationStatus[account] = false;
    }
}