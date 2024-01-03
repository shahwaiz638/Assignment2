// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./OrderProcessing.sol";

contract PromotionsAndDiscounts {
    address public owner;
    mapping(address => uint256) public userDiscounts;
    mapping(address => uint256) public finalDiscountAmount;
    OrderProcessing public orderContract;

    event PromotionApplied(address indexed user, uint256 discountPercentage);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _orderContractAddress) {
        owner = msg.sender;
        orderContract = OrderProcessing(_orderContractAddress);
    }

    function applyPromotion(
        address user,
        uint256 discountPercentage
    ) external onlyOwner {
        require(discountPercentage < 100, "Invalid discount percentage");
        require(discountPercentage > 0, "Invalid discount percentage");
        userDiscounts[user] = discountPercentage;

        uint256 orderAmount = orderContract.getTotalPrice(user);

        finalDiscountAmount[user] = calculateDiscount(user, orderAmount);
        emit PromotionApplied(user, discountPercentage);
    }

    function calculateDiscount(
        address user,
        uint256 originalAmount
    ) internal view returns (uint256) {
        uint256 discountPercentage = userDiscounts[user];
        return (originalAmount * (100 - discountPercentage)) / 100;
    }

    function getDiscountAmount(address user) external view returns (uint256) {
        return finalDiscountAmount[user];
    }
}