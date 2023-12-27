// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract BalanceManager {
    address public admin;
    uint256 public smartSupplyBalance;

    event FundsAdded(address indexed from, uint256 amount);

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

    function withdrawFunds(uint256 amount) external onlyAdmin {
        require(amount <= smartSupplyBalance, "Insufficient funds");
        smartSupplyBalance -= amount;
        payable(admin).transfer(amount);
    }
}