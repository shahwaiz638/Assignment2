// cafeteria user dashboard

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import {
  Cafe_ABI,
  Cafe_ADDRESS,
  Order_ABI,
  Order_ADDRESS,
  Promotions_ABI,
  Promotions_ADDRESS,
  Pay_ADDRESS,
  Pay_ABI,
} from './config.js';

function UserDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [menuContract, setMenuContract] = useState(null);
  const [orderContract, setOrderContract] = useState(null);
  const [paymentContract, setPaymentContract] = useState(null);
  const [promotionsContract, setPromotionsContract] = useState(null);
  const [totalAccounts, setTotalAccounts] = useState(0);
  var [originalPrice, setOriginalPrice] = useState(null);
  var [discountedPrice, setDiscountedPrice] = useState(null);
  var [discountPercentage, setDiscountPercentage] = useState(null);
  var [discountApplied, setDiscountApplied] = useState(false);

  const [menu, setMenu] = useState({
    itemIds: [],
    itemNames: [],
    itemPrices: [],
    itemAvailabilities: [],
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState(Array(menu.itemIds.length).fill(1));
  

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const w3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
        const cafeContract = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
        const orderContract = new w3.eth.Contract(Order_ABI, Order_ADDRESS);
        const promotionsContract = new w3.eth.Contract(Promotions_ABI, Promotions_ADDRESS);
        const paymentContract = new w3.eth.Contract(Pay_ABI, Pay_ADDRESS);
        const accounts = await w3.eth.getAccounts();

        setWeb3(w3);
        setMenuContract(cafeContract);
        setOrderContract(orderContract);
        setPromotionsContract(promotionsContract);
        setPaymentContract(paymentContract);

        if (accounts.length > 0) {
          setTotalAccounts(accounts.length);
          const menuDetails = await cafeContract.methods.viewMenu().call();
          setMenu({
            itemIds: menuDetails[0],
            itemNames: menuDetails[1],
            itemPrices: menuDetails[2],
            itemAvailabilities: menuDetails[3],
          });
        } else {
          navigate('/');
        }

        console.log('Updated State - Selected Items:', selectedItems);
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();
  }, [navigate, selectedItems]);

  const handleToggleItem = (itemId) => {
    const index = selectedItems.indexOf(itemId);
    console.log('Before Toggle - Selected Items:', selectedItems);

    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
      setQuantities([...quantities, 1]); // Default quantity is 1
    } else {
      const updatedSelectedItems = [...selectedItems];
      const updatedQuantities = [...quantities];
      updatedSelectedItems.splice(index, 1);
      updatedQuantities.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
      setQuantities(updatedQuantities);
    }

    console.log('After Toggle - Selected Items:', selectedItems);
  };

  const handleQuantityChange = (itemId, quantity) => {
    const index = selectedItems.indexOf(itemId);
    if (index !== -1) {
      const updatedQuantities = [...quantities];
      updatedQuantities[index] = parseInt(quantity, 10);
      setQuantities(updatedQuantities);
    }
  };

  const handleViewTotalPrice = async () => {
    try {
      const itemIds = selectedItems.map(Number);
      const totalPrice = await orderContract.methods.getTotalPrice(selectedItems).call({
        from: (await web3.eth.getAccounts())[5],
      });

      const userAddress = (await web3.eth.getAccounts())[5];
      const userDiscountAmount = await promotionsContract.methods.getDiscountAmount(userAddress).call();

      const originalPriceInWei = totalPrice.toString();
      const userDiscountAmountInWei = userDiscountAmount.toString();

      const originalPriceInEth = web3.utils.fromWei(originalPriceInWei, 'ether');
      const discountAmountInEth = web3.utils.fromWei(userDiscountAmountInWei, 'ether');
      const discountedPriceInEth = originalPriceInEth - discountAmountInEth;

      setOriginalPrice(originalPriceInEth);
      //setDiscountAmount(discountAmountInEth);
      setDiscountedPrice(discountedPriceInEth);
      //setDiscountApplied(false); 

      console.log("Original Price:", originalPriceInEth, "ETH");
      console.log("Discount Amount:", discountAmountInEth, "ETH");
      console.log("Discounted Price:", discountedPriceInEth.toFixed(18), "ETH");
    } catch (error) {
      console.error('Error calculating total price:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const itemIds = selectedItems.map(Number);
      const quantitiesArray = quantities.map(Number);

      await orderContract.methods.placeOrder(itemIds, quantitiesArray).send({
        from: (await web3.eth.getAccounts())[5],
      });

      const totalPrice = await orderContract.methods.getTotalPrice(selectedItems).call({
        from: (await web3.eth.getAccounts())[5],
      });
      console.log("totalPrice: ", totalPrice);

      setSelectedItems([]);
      setQuantities([]);
      alert('Order placed successfully!');

      await paymentContract.processPayment(totalPrice, {
        from: (await web3.eth.getAccounts())[5],
        value: web3.utils.toWei((totalPrice + 1n).toString(), 'ether'),  // Sending ether along with the transaction
      });

      alert('Payment Successful!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleViewDiscount = async () => {
    try {
      const userAddress = (await web3.eth.getAccounts())[5];
      const userDiscountPercentage = await promotionsContract.methods.getDiscountPercentage(userAddress).call();
      setDiscountPercentage(Number(userDiscountPercentage));
      console.log('Discount Percentage:', userDiscountPercentage + '%');
    } catch (error) {
      console.error('Error getting discount:', error);
    }
  };

  const handleApplyDiscount = async () => {
    try {
      const userAddress = (await web3.eth.getAccounts())[5];
      await promotionsContract.methods.applyPromotion(userAddress, discountPercentage).send({
        from: (await web3.eth.getAccounts())[0],
      });
  
      // Recalculate discounted price using the updated discount percentage
      const updatedTotalPrice = await orderContract.methods.getTotalPrice(selectedItems).call({
        from: (await web3.eth.getAccounts())[5],
      });
  
      const updatedOriginalPriceInWei = updatedTotalPrice.toString();
      const updatedOriginalPriceInEth = web3.utils.fromWei(updatedOriginalPriceInWei, 'ether');
      const updatedDiscountAmountInWei = await promotionsContract.methods.getDiscountAmount(userAddress).call();
      const updatedDiscountAmountInEth = web3.utils.fromWei(updatedDiscountAmountInWei, 'ether');
      const updatedDiscountedPriceInEth = updatedOriginalPriceInEth - updatedDiscountAmountInEth;
  
      setOriginalPrice(updatedOriginalPriceInEth);
      setDiscountedPrice(updatedDiscountedPriceInEth);
      setDiscountApplied(true);
  
      console.log("Updated Original Price:", updatedOriginalPriceInEth, "ETH");
      console.log("Updated Discounted Price:", updatedDiscountedPriceInEth.toFixed(18), "ETH");
    } catch (error) {
      console.error('Error applying discount:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>

      <div>
        <p>Total number of accounts: {totalAccounts}</p>
      </div>

      <div>
        <h3>Menu</h3>
        <ul>
          {menu.itemIds.map((itemId, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(itemId)}
                  onChange={() => handleToggleItem(itemId)}
                />
                {menu.itemNames[index]} - Price: {web3.utils.fromWei(menu.itemPrices[index], 'ether')} ETH&nbsp;
              </label>
              <input
                type="number"
                min="1"
                value={quantities[index]}
                onChange={(e) => handleQuantityChange(itemId, e.target.value)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button className="blue-button" onClick={handleViewTotalPrice}>
          View Total Price
        </button>
        {originalPrice !== null && (
          <div>
            <p>
              Original Price: {originalPrice} ETH<br />
              {discountPercentage !== null && (
                <span>
                  Current Discount Percentage: {discountPercentage}%
                </span>
              )} <br/>
              Discounted Price: {discountedPrice.toFixed(18)} ETH
            </p>
          </div>
        )}
      </div>

      <div>
        <button className="blue-button" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      <div>
        <button className="blue-button" onClick={handleViewDiscount}>
          View Discount Percentage
        </button>
        {discountPercentage !== null && (
          <div>
            <p>Current Discount Percentage: {discountPercentage}%</p>
          </div>
        )}
      </div>

      <div>
        <button className="blue-button" onClick={handleApplyDiscount}>
          Apply Discount
        </button>
        {discountApplied && (
          <div>
            <p>
              Discount applied! <br />
              Discounted amount: {discountedPrice.toFixed(18)} ETH
            </p>
          </div>
        )}
      </div>

      <div>
        <button className="button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;