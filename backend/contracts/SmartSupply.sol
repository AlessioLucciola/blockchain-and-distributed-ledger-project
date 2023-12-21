// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SmartSupply{
    address payable [] public recipients;
    event TransferReceived(address _from, uint _amount);

    constructor (address payable [] memory _recipients){
        for (uint i = 0; i < _recipients.length; i++){ // loop through all the recipients and add them to the array
            recipients.push(_recipients[i]);
        }
    }

    receive() payable external { // receive function to receive ether 
        uint256 amount = msg.value / recipients.length; // divide the amount of ether by the number of recipients
        for (uint i = 0; i < recipients.length; i++){ // loop through all the recipients and send them the amount of ether
            recipients[i].transfer(amount);
        }
        emit TransferReceived(msg.sender, msg.value); // emit an event to notify the frontend that ether has been received
    }
}