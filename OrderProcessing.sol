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

    function placeOrder(uint256[] memory itemIds, uint256[] memory quantities) external {
        require(itemIds.length == quantities.length, "Invalid input lengths");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < itemIds.length; i++) {
            require(menuContract.checkAvailability(itemIds[i]), "Item not available");
            (string memory itemName, uint256 itemPrice, uint256 itemAvailabilities) = menuContract.viewMenuItem(itemIds[i]);
            totalAmount += itemPrice * quantities[i];
            menuContract.updateAvailability(itemIds[i], itemName, quantities[i]);
        }

        bill[msg.sender] += totalAmount;
        emit OrderPlaced(msg.sender, itemIds, quantities, totalAmount);
    }

    function getTotalPrice(uint256[] memory itemIds) external view returns (uint256) {
        uint256 totalPrice = 0;

        for (uint256 i = 0; i < itemIds.length; i++) {
            require(menuContract.checkAvailability(itemIds[i]), "Item not available");
            (string memory itemName, uint256 itemPrice, uint256 itemAvailabilities) = menuContract.viewMenuItem(itemIds[i]);
            totalPrice += itemPrice;
        }

        return totalPrice;
    }
}
