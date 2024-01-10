// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract MenuManagement {
    address public owner;

    struct MenuItem {
        string name;
        uint256 price;
        uint256 available;
    }

    mapping(uint256 => MenuItem) public menu;
    uint256 public totalItems;

    // Separate array to store menu item keys
    uint256[] public menuItemIds;

    event MenuItemAdded(
        uint256 itemId,
        string itemName,
        uint256 price,
        uint256 availability
    );

    event MenuItemPriceUpdated(
        uint256 itemId,
        string itemName,
        uint256 newPrice
    );

    event MenuItemAvailabilityUpdated(
        uint256 itemId,
        string itemName,
        uint256 newAvailability
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addMenuItem(
        uint256 itemId,
        string memory itemName,
        uint256 price,
        uint256 available
    ) external onlyOwner{
        totalItems++;
        menu[itemId] = MenuItem(itemName, price, available);
        menuItemIds.push(itemId);
        //emit MenuItemAdded(itemId, itemName, price, available);
    }

    function updatePrice(
        uint256 itemId,
        string memory itemName,
        uint256 newPrice
    ) external  onlyOwner{
        require(menu[itemId].available > 0, "Item not found");
        menu[itemId].price = newPrice;
        //emit MenuItemPriceUpdated(itemId, itemName, newPrice);
    }

    function updateAvailability(
        uint256 itemId,
        string memory itemName,
        uint256 newAvailability
    ) external  {
        require(menu[itemId].available > 0, "Item not found");
        menu[itemId].available = newAvailability;
        //emit MenuItemAvailabilityUpdated(itemId, itemName, newAvailability);
    }

    function checkAvailability(uint256 itemId) external view returns (bool) {
        bool availabe = false;
        if (menu[itemId].available > 0) {
            availabe = true;
            return availabe;
        }
        return availabe;
    }

    function viewMenuItem(
        uint256 itemId
    ) public view returns (string memory, uint256, uint256) {
        // View details of a specific menu item
        return (menu[itemId].name, menu[itemId].price, menu[itemId].available);
    }

    function getAvailability(uint256 itemId) external view returns (uint256) {
        
        return menu[itemId].available;
    }

    function viewMenu()
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        // View the entire menu
        uint256[] memory itemIds = new uint256[](menuItemIds.length);
        string[] memory itemNames = new string[](menuItemIds.length);
        uint256[] memory itemPrices = new uint256[](menuItemIds.length);
        uint256[] memory itemAvailabilities = new uint256[](menuItemIds.length);

        for (uint256 i = 0; i < menuItemIds.length; i++) {
            uint256 itemId = menuItemIds[i];
            itemIds[i] = itemId;
            itemNames[i] = menu[itemId].name;
            itemPrices[i] = menu[itemId].price;
            itemAvailabilities[i] = menu[itemId].available;
        }

        return (itemIds, itemNames, itemPrices, itemAvailabilities);
    }
}