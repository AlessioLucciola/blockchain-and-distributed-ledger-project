// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract BalanceManager {
    address public admin;
    uint256 public smartSupplyBalance;
    uint256 private verificationAmount = 50000000 gwei; // base price for verification 
    uint256 private certificationPercentage = 10; // base price for certification 

    event FundsAdded(address indexed from, uint256 amount);
    event VerificationAmountChanged(address indexed from, uint256 amount);
    event CertificationPercentageChanged(address indexed from, uint256 amount);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addFunds() external payable {
        require(msg.value > 0, "Funds sent must be greater than 0");
        smartSupplyBalance += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    function getSmartSupplyBalance() public view returns(uint256) {
        return smartSupplyBalance;
    }

    function withdrawFunds(uint256 amount) external onlyAdmin {
        require(amount <= smartSupplyBalance, "Insufficient funds");
        smartSupplyBalance -= amount;
        payable(admin).transfer(amount);
    }
    
    function getVerificationAmount() external view returns(uint256) {
        return verificationAmount;
    }

    function setVerificationAmount(uint256 _amount) external onlyAdmin {
        verificationAmount = _amount;
        emit VerificationAmountChanged(msg.sender, verificationAmount);
    }

    function getCertificationPercentage() external view returns(uint256) {
        return certificationPercentage;
    }
    
    function setCertificationPercentage(uint256 _percentage) external onlyAdmin {
        certificationPercentage = _percentage;
        emit CertificationPercentageChanged(msg.sender, certificationPercentage);
    }
}