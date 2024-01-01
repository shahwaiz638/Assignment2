// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentContract is ERC20 {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() ERC20("FastCoin", "FC") {
        owner = msg.sender;
    }

    function processPayment(
        address recipient,
        uint256 amount
    ) external onlyOwner {
        _transfer(msg.sender, recipient, amount);
    }
}
