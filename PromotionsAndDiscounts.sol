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

    event LogDebug(string message, uint256 value);

    constructor(address _orderContractAddress) {
        owner = msg.sender;
        orderContract = OrderProcessing(_orderContractAddress);
    }

    function setDiscountPercentage(address user, uint256 discountPercentage) external onlyOwner {
        require(discountPercentage <= 100, "Invalid discount percentage");
        userDiscounts[user] = discountPercentage;
    }
    function getDiscountPercentage(address user) external view returns (uint256) {
        return userDiscounts[user];
    }

     function applyPromotion(address user) external {
        uint256 discountPercentage = userDiscounts[user];
        emit LogDebug("Discount Percentage:", discountPercentage);

        require(discountPercentage > 0, "Discount percentage must be greater than 0");

        // Access total order amount directly from bill mapping
        uint256 orderAmount = orderContract.getTotalBillAmount(user);
        emit LogDebug("Order Amount:", orderAmount);
        finalDiscountAmount[user] = calculateDiscount(orderAmount, discountPercentage);

        // Log values for debugging
        //console.log("Order Amount:", orderAmount);
        //console.log("Discount Amount:", finalDiscountAmount[user]);
    }

    function calculateDiscount(uint256 originalAmount, uint256 discountPercentage) internal pure returns (uint256) {
        return (originalAmount * (100 - discountPercentage)) / 100;
    }

    function getDiscountAmount(address user) external view returns (uint256) {
        return finalDiscountAmount[user];
    }
}
