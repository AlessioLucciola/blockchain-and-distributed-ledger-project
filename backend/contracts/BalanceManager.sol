// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract BalanceManager {
    address public admin;
    uint256 public smartSupplyBalance;
    uint256 private verificationAmount = 50000000 gwei; // Base price for verification 
    uint256 private certificationPercentage = 10; // Base price for certification 

    // Define a set of events triggered when adding funds or changing the verification/certification amount
    event FundsAdded(address indexed from, uint256 amount);
    event VerificationAmountChanged(address indexed from, uint256 amount);
    event CertificationPercentageChanged(address indexed from, uint256 amount);
    
    // Modifier function to allow other functions to be executed only by the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    // Constructor function to set the admin
    constructor() {
        admin = msg.sender;
    }

    // Function to add funds to the smart contract
    function addFunds() external payable {
        require(msg.value > 0, "Funds sent must be greater than 0"); // Check if the amount sent is greater than 0
        smartSupplyBalance += msg.value; // Add the amount sent to the smartSupplyBalance
        emit FundsAdded(msg.sender, msg.value); // Trigger the event
    }

    // Function to get the smartSupplyBalance
    function getSmartSupplyBalance() public view returns(uint256) {
        return smartSupplyBalance;
    }

    // Function to withdraw funds from the smart contract (only executable by the admin)
    function withdrawFunds(uint256 amount) external onlyAdmin {
        require(amount <= smartSupplyBalance, "Insufficient funds");
        smartSupplyBalance -= amount;
        payable(admin).transfer(amount);
    }
    
    // Function to get the verification amount
    function getVerificationAmount() external view returns(uint256) {
        return verificationAmount;
    }

    // Function to set the verification amount (only executable by the admin)
    // The verification amount is the amount that an entity has to pay to get the verified badge
    function setVerificationAmount(uint256 _amount) external onlyAdmin {
        verificationAmount = _amount;
        emit VerificationAmountChanged(msg.sender, verificationAmount);
    }

    // Function to get the certification percentage
    function getCertificationPercentage() external view returns(uint256) {
        return certificationPercentage;
    }
    
    // Function to set the certification percentage (only executable by the admin)
    // The certification percentage is the percentage of the product price that the retailer has to pay to get the certification
    function setCertificationPercentage(uint256 _percentage) external onlyAdmin {
        certificationPercentage = _percentage;
        emit CertificationPercentageChanged(msg.sender, certificationPercentage);
    }
}