import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import web3 from './web3'; // Import the web3 instance
import './CafeteriaUserDashboard.css';
import { Order_ABI, Order_ADDRESS, Cafe_ABI, Cafe_ADDRESS } from './config.js';

function CafeteriaUserDashboard({ orderProcessingContract }) {
  const navigate = useNavigate();
  const [menuDetails, setMenuDetails] = useState({
    itemIds: [],
    itemNames: [],
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleBackToHome = () => {
    // Navigate back to the home page
    navigate('/');
  };

  const fetchMenuItems = async () => {
    try {
      // Connect to the MenuManagement contract
      const menuManagement = new web3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
  
      // Call the viewMenu function from the MenuManagement contract
      const menuDetails = await menuManagement.methods.viewMenu().call();
      console.log('Fetched Menu Details:', menuDetails);
  
      setMenuDetails({
        itemIds: menuDetails[0].map(Number),
        itemNames: menuDetails[1],
      });
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };
  
  

  const handlePlaceOrder = async () => {
    try {
      // Check if items are selected
      if (selectedItems.length === 0) {
        alert('Please select items to place an order.');
        return;
      }

      // Convert selectedItems and quantities to arrays of integers
      const itemIds = selectedItems.map(Number);
      const quantitiesArray = quantities.map(Number);

      // Call the placeOrder function from the OrderProcessing contract
      await orderProcessingContract.methods
        .placeOrder(itemIds, quantitiesArray)
        .send({ from: (await web3.eth.getAccounts())[0] }); // Replace with the actual account

      // Update UI or perform other actions as needed

      // Clear selected items and quantities
      setSelectedItems([]);
      setQuantities([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  const handleGetTotalPrice = async () => {
    try {
      // Convert selectedItems and quantities to arrays of integers
      const itemIds = selectedItems.map(Number);
      const quantitiesArray = quantities.map(Number);

      // Call the getTotalPrice function from the OrderProcessing contract
      const totalPrice = await orderProcessingContract.methods
        .getTotalPrice(itemIds, quantitiesArray)
        .call({ from: (await web3.eth.getAccounts())[0] }); // Replace with the actual account

      // Update the state with the calculated total price
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error getting total price:', error);
    }
  };

  const handleCheckboxChange = (itemId, isChecked) => {
    // Update selected items based on checkbox selection
    if (isChecked) {
      setSelectedItems((prevItems) => [...prevItems, itemId]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item !== itemId)
      );
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    // Update quantities based on input change
    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const index = selectedItems.indexOf(itemId);

      if (index !== -1) {
        updatedQuantities[index] = quantity;
      }

      return updatedQuantities;
    });
  };

  useEffect(() => {
    // Fetch menu items on component mount
    fetchMenuItems();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="dashboard">
      <h2>Cafeteria User Dashboard</h2>

      {/* Display menu items and checkboxes for selection */}
      <div>
        {menuDetails.itemIds.map((itemId, index) => (
          <div key={itemId}>
            <input
              type="checkbox"
              checked={selectedItems.includes(itemId)}
              onChange={(e) => handleCheckboxChange(itemId, e.target.checked)}
            />
            <span>{menuDetails.itemNames[index]}</span>
            <input
              type="number"
              value={quantities[selectedItems.indexOf(itemId)] || ''}
              onChange={(e) => handleQuantityChange(itemId, e.target.value)}
              disabled={!selectedItems.includes(itemId)}
            />
          </div>
        ))}
      </div>

      <div>
        <button className="blue-button" onClick={handleGetTotalPrice}>
          View Total Price
        </button>{' '}
        <br /> 
        {totalPrice > 0 && <div>Total Price: {totalPrice}</div>}
      </div>

      <div>
        <button className="blue-button" onClick={handlePlaceOrder}>
          Place Order
        </button>{' '}
        <br />
      </div>

      <div>
        <button className="button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CafeteriaUserDashboard;
