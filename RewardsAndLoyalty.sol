// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardsAndLoyalty {
    address public owner;
    IERC20 public tokenContract;

    event LoyaltyTokensCredited(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _tokenContract) {
        owner = msg.sender;
        tokenContract = IERC20(_tokenContract);
    }

    function creditLoyaltyTokens(address user, uint256 amount) external onlyOwner{
        tokenContract.transfer(user, amount);
        emit LoyaltyTokensCredited(user, amount);
    }
}
