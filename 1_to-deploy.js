const MenuManagement = artifacts.require("MenuManagement");
const OrderProcessing = artifacts.require("OrderProcessing");
const PaymentContract = artifacts.require("Payment");
const RewardsAndLoyalty = artifacts.require("RewardsAndLoyalty");
const PromotionsAndDiscounts = artifacts.require("PromotionsAndDiscounts");

module.exports = async function (deployer) {
  // Deploy MenuManagement contract
  await deployer.deploy(MenuManagement);

  // Deploy OrderProcessing contract and link it to MenuManagement


  await deployer.deploy(OrderProcessing, MenuManagement.address);

  // Deploy PromotionsAndDiscounts contract and pass the address of OrderProcessing contract
  await deployer.deploy(PromotionsAndDiscounts, OrderProcessing.address);

  // Deploy PaymentContract and pass the address of PromotionsAndDiscounts contract
  await deployer.deploy(PaymentContract, PromotionsAndDiscounts.address);


  // Deploy RewardsAndLoyalty contract and link it to PaymentContract
  await deployer.deploy(RewardsAndLoyalty, PaymentContract.address);
};



