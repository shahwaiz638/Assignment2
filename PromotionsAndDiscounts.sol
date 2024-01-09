// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./OrderProcessing.sol";

contract PromotionsAndDiscounts {
    address public owner;
    mapping(address => uint256) public userDiscounts;
    mapping(address => uint256) public finalDiscountAmount;
    OrderProcessing public orderContract;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _orderContractAddress) {
        owner = msg.sender;
        orderContract = OrderProcessing(_orderContractAddress);
    }

    function setDiscountPercentage(address user, uint256 discountPercentage) external {
        require(discountPercentage < 100, "Invalid discount percentage");
        require(discountPercentage >= 0, "Invalid discount percentage");
        userDiscounts[user] = discountPercentage;
    }

    function getDiscountPercentage(address user) external view returns (uint256) {
        return userDiscounts[user];
    }

    function applyPromotion(address user) external {
        uint256 discountPercentage = userDiscounts[user];
        require(discountPercentage > 0, "Discount percentage must be greater than 0");

        uint256 orderAmount = orderContract.getTotalPrice();
        finalDiscountAmount[user] = calculateDiscount(orderAmount, discountPercentage);
    }

    function calculateDiscount(uint256 originalAmount, uint256 discountPercentage) internal pure returns (uint256) {
        return (originalAmount * (100 - discountPercentage)) / 100;
    }

    function getDiscountAmount(address user) external view returns (uint256) {
        return finalDiscountAmount[user];
    }
}
