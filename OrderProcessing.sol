// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./MenuManagement.sol"; 

contract OrderProcessing {
    address public owner;
    MenuManagement public menuContract; 
    mapping(address => uint256) bill;

    event OrderPlaced(
        address indexed user,
        uint256[] itemIds,
        uint256[] quantities,
        uint256 totalAmount
    );

    constructor(address _menuContract) {
        owner = msg.sender;
        menuContract = MenuManagement(_menuContract); 
    }

    function placeOrder(
        address user,
        uint256[] memory itemId,
        uint256[] memory quantities
    ) external {
        require(itemId.length == quantities.length, "Invalid input lengths");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < itemId.length; i++) {
            require(
                menuContract.checkAvailability(itemId[i]),
                "Item not available"
            );
            (string memory itemName, uint256 itemPrice, uint256 itemAvailabilities) = menuContract.viewMenuItem(itemId[i]);
            totalAmount += itemPrice * quantities[i];
            menuContract.updateAvailability(itemId[i], itemName, quantities[i]);
        }

        bill[user] += totalAmount;
        emit OrderPlaced(msg.sender, itemId, quantities, totalAmount);
    }

    function getTotalPrice(address user) external view returns (uint256) {
        return bill[user];
    }
}
