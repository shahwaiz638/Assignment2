// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./MenuManagement.sol"; 

contract OrderProcessing {
    address public owner;
    uint256 totalPrice;
    MenuManagement public menuContract;
    mapping(address => uint256) bill;

    

    constructor(address _menuContract) {
        owner = msg.sender;
        menuContract = MenuManagement(_menuContract); 
    }

   function placeOrder(
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

    bill[msg.sender] += totalAmount;
    //totalPrice += totalAmount;
    //emit OrderPlaced(msg.sender, itemId, quantities, totalAmount);
}

    function getTotalPrice() external view returns (uint256) {
        return bill[msg.sender];
    }
}
