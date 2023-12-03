// SPDX-License-Identifier: UNLICENSED 
pragma solidity >=0.8.0 <0.9.0;

import "./Roles.sol";

contract StoreRole {
    using Roles for Roles.Role;
    Roles.Role private store; //Define the role for stores

    constructor() {
        _addStoreRole(msg.sender);
    }

    function isStore(address account) public view returns (bool) {
        return store.has(account);
    }

    function _addStoreRole(address account) public {
        require(isStore(msg.sender), "Only a store can perform this operation.");
        _addStoreRole(account);
    }
}