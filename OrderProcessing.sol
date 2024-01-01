// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderProcessing {
    address public owner;
    MenuManagement public menuContract;

    event OrderPlaced(
        address indexed user,
        uint256[] itemIds,
        uint256[] quantities,
        uint256 totalAmount
    );

    constructor(address _menuContract) {
        owner = msg.sender;
        menuContract = MenuManagment(_menuContract);
    }

    function placeOrder(
        uint256[] memory itemId,
        uint256[] memory quantities
    ) external view returns (uint256) {
        require(itemId.length == quantities.length, "Invalid input lengths");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < itemId.length; i++) {
            require(
                menuContract.checkAvailability(itemId[i]),
                "Item not available"
            );
            totalAmount += menuContract.menu(itemId[i]).price * quantities[i];
            menuContract.menu(itemId[i]).availabe -= quantities[i];
        }

        emit OrderPlaced(msg.sender, itemIds, quantities, totalAmount);

        return totalAmount;
    }
}
