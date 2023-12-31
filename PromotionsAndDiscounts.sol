// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromotionsAndDiscounts {
    mapping(address => uint256) public userDiscounts;

    function applyPromotion(address user, uint256 discountPercentage) external {
        require(discountPercentage <= 100, "Invalid discount percentage");
        userDiscounts[user] = discountPercentage;
    }

    function calculateDiscountedAmount(uint256 originalAmount, address user) external view returns (uint256) {
        uint256 discountPercentage = userDiscounts[user];
        return (originalAmount * (100 - discountPercentage)) / 100;
    }
}
