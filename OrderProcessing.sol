// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderProcessing {
    MenuManagement public menuContract;

    constructor(MenuManagement _menuContract) {
        menuContract = _menuContract;
    }

    function placeOrder(string[] memory items, uint256[] memory quantities) external view returns (uint256) {
        require(items.length == quantities.length, "Invalid input lengths");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < items.length; i++) {
            require(menuContract.checkAvailability(items[i]), "Item not available");
            totalAmount += menuContract.menu(items[i]).price * quantities[i];
        }

        return totalAmount;
    }
}
