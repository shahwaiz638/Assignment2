// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromotionsAndDiscounts {
    address public owner;
    mapping(address => uint256) public userDiscounts;
    //OrderProcessingContract public orderContract;

    event PromotionApplied(address indexed user, uint256 discountPercentage);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() /*address _orderContractAddress*/ {
        owner = msg.sender;
        //orderContract = OrderProcessingContract(_orderContractAddress);
    }

    function applyPromotion(
        address user,
        uint256 discountPercentage
    ) external onlyOwner {
        require(discountPercentage < 100, "Invalid discount percentage");
        require(discountPercentage > 0, "Invalid discount percentage");
        userDiscounts[user] = discountPercentage;

        //uint256 discountAmount = calculateDiscount(orderAmount);
        emit PromotionApplied(user, discountPercentage);
    }

    function calculateDiscountedAmount(
        uint256 originalAmount,
        address user
    ) external view returns (uint256) {
        uint256 discountPercentage = userDiscounts[user];
        return (originalAmount * (100 - discountPercentage)) / 100;
    }
}
