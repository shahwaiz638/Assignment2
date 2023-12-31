// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MenuManagement {
    struct MenuItem {
        uint256 price;
        bool available;
    }

    mapping(string => MenuItem) public menu;

    function addMenuItem(string memory itemName, uint256 price) external {
        menu[itemName] = MenuItem(price, true);
    }

    function updatePrice(string memory itemName, uint256 newPrice) external {
        require(menu[itemName].available, "Item not found");
        menu[itemName].price = newPrice;
    }

    function checkAvailability(string memory itemName) external view returns (bool) {
        return menu[itemName].available;
    }
}
