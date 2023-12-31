// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardsAndLoyalty {
    IERC20 public tokenContract;

    constructor(IERC20 _tokenContract) {
        tokenContract = _tokenContract;
    }

    function creditLoyaltyTokens(address user, uint256 amount) external {
        tokenContract.transfer(user, amount);
    }
}
