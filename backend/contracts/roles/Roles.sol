// SPDX-License-Identifier: UNLICENSED 
pragma solidity >=0.8.0 <0.9.0;

library Roles {
    struct Role {
        mapping (address => bool) entity;
    }

    function add_role(Role storage role, address account) internal {
        require(account != address(0), "Account address must not be 0.");
        require(!has(role, account), "You are trying to assign the same role to the account");
        role.entity[account] = true;
    }

    function remove_role(Role storage role, address account) internal {
        require(account != address(0), "Account address must not be 0.");
        require(has(role, account), "You are trying to remove a role from an account that doesn't have it.");
        role.entity[account] = false;
    }

    function has(Role storage role, address account) public view returns (bool) {
        require(account != address(0), "Account address must not be 0.");
        return role.entity[account];
    }
}