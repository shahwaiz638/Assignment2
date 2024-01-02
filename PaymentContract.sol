// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentContract is ERC20 {
    address public owner; // Admin
    address public cafe;
    PromotionsAndDiscountsContract public PromotionContract;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyCafe() {
        require(msg.sender == cafe, "Not the cafe");
        _;
    }

    constructor(address _PromotionContractAddress) ERC20("FastCoin", "FC") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10 ** decimals()); // Mint initial supply
        PromotionContract = PromotionsAndDiscountsContract(
            _PromotionContractAddress
        );
    }

    function setCafe(address _cafe) external onlyOwner {
        cafe = _cafe;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }

    function processPayment(uint256 amount) external payable {
        require(
            amount > PromotionContract.getDiscountAmount(msg.sender),
            "Not enough amount sent"
        );
        require(balanceOf(msg.value) > amount, "Insufficent funds in account");
        _transfer(msg.sender, cafe, amount);
    }

    function refundPayment(address user, unit256 amount) external onlyCafe {
        _transfer(cafe, user, amount);
    }
}
