// CafeteriaStaffDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CafeteriaStaffDashboard.css';
import { Cafe_ABI, Cafe_ADDRESS } from './config.js';
import Web3 from 'web3';

function CafeteriaStaffDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [menuItemIds, setMenuItemIds] = useState([]);
  const [menuItemDetails, setMenuItemDetails] = useState({
    name: '',
    price: 0,
    available: 0,
  });
  const [menuDetails, setMenuDetails] = useState({
    itemIds: [],
    itemNames: [],
    itemPrices: [],
    itemAvailabilities: [],
  });
  const [newMenuItemId, setNewMenuItemId] = useState(0);
  const [newMenuItemName, setNewMenuItemName] = useState('');
  const [newMenuItemPrice, setNewMenuItemPrice] = useState(0);
  const [newMenuItemAvailability, setNewMenuItemAvailability] = useState(0);
  const [updateItemId, setUpdateItemId] = useState(0);
  const [updateItemPrice, setUpdateItemPrice] = useState(0);
  const [updateItemAvailability, setUpdateItemAvailability] = useState(0);
  const [action, setAction] = useState('');

  // Initialize Web3 and contract on component mount
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const w3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
        const cafeContract = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
        const accounts = await w3.eth.getAccounts();
        setWeb3(w3);
        setContract(cafeContract);

        // Check if the current account is the owner (staff)
        if (1 /* Add logic to check if the current account is staff */) {
          // Load menu item ids if needed
          const ids = await cafeContract.methods.menuItemIds().call();
          setMenuItemIds(ids);
        } else {
          // Redirect to the home page if not staff
          navigate('/');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();
  }, [navigate]);

  const handleBackToHome = () => {
    // Navigate back to the home page
    navigate('/');
  };


  const handleAddMenuItem = async () => {
    try {
      // Call the addMenuItem function from the contract
      await contract.methods
        .addMenuItem(
          newMenuItemId,
          newMenuItemName,
          newMenuItemPrice,
          newMenuItemAvailability
        )
        .send({
          from: (await web3.eth.getAccounts())[0],
          gas: 3000000, // Set an appropriate gas limit
          gasPrice: '10000000000', // Set an appropriate gas price
        });
      // Update the list of menu item ids
      const ids = await contract.methods.menuItemIds().call();
      setMenuItemIds(ids);
      // Clear input fields
      setNewMenuItemId(0);
      setNewMenuItemName('');
      setNewMenuItemPrice(0);
      setNewMenuItemAvailability(0);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateItemPrice = async () => {
    try {
      // Call the updatePrice function from the contract
      await contract.methods
        .updatePrice(updateItemId, '', updateItemPrice)
        .send({ from: (await web3.eth.getAccounts())[0] });
      // Clear input fields
      setUpdateItemId(0);
      setUpdateItemPrice(0);
    } catch (error) {
      console.error('Error updating item price:', error);
    }
  };

  const handleUpdateItemAvailability = async () => {
    try {
      // Call the updateAvailability function from the contract
      await contract.methods
        .updateAvailability(updateItemId, '', updateItemAvailability)
        .send({ from: (await web3.eth.getAccounts())[0] });
      // Clear input fields
      setUpdateItemId(0);
      setUpdateItemAvailability(0);
    } catch (error) {
      console.error('Error updating item availability:', error);
    }
  };

  const handleViewMenuItem = async (itemId) => {
    try {
      const details = await contract.methods.viewMenuItem(itemId).call();
      setMenuItemDetails({
        id: itemId,
        name: details[0] || '',
        price: parseInt(details[1], 10) || 0,
        available: parseInt(details[2], 10) || 0,
      });
    } catch (error) {
      console.error('Error viewing menu item:', error);
    }
  };
  

  const handleViewMenu = async () => {
    try {
      // Call the viewMenu function from the contract
      const menuDetails = await contract.methods.viewMenu().call();
      setMenuDetails({
        itemIds: menuDetails[0],
        itemNames: menuDetails[1],
        itemPrices: menuDetails[2],
        itemAvailabilities: menuDetails[3],
      });
    } catch (error) {
      console.error('Error viewing menu:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Cafeteria Staff Dashboard</h2>

      <div className="menu-actions">
        <h3>Menu Actions</h3>

        <div>
          <button className="blue-button" onClick={() => setAction('add')}>
            Add Item
          </button>{' '}
          <br />
          {action === 'add' && (
            <div>
              <label>Item ID : </label>
              <input
                type="number"
                value={newMenuItemId}
                onChange={(e) => setNewMenuItemId(e.target.value)}
              />{' '}
              <br />
              <label>Item Name : </label>
              <input
                type="text"
                value={newMenuItemName}
                onChange={(e) => setNewMenuItemName(e.target.value)}
              />{' '}
              <br />
              <label>Item Price : </label>
              <input
                type="number"
                value={newMenuItemPrice}
                onChange={(e) => setNewMenuItemPrice(e.target.value)}
              />{' '}
              <br />
              <label>Availability : </label>
              <input
                type="number"
                value={newMenuItemAvailability}
                onChange={(e) =>
                  setNewMenuItemAvailability(e.target.value)
                }
              />{' '}
              <br />
              <button className="blue-button" onClick={handleAddMenuItem}>
                Add
              </button>{' '}
              <br /> <br />
            </div>
          )}
        </div>

        <div>
          <button
            className="blue-button"
            onClick={() => setAction('updatePrice')}
          >
            Update Price
          </button>{' '}
          <br />
          {action === 'updatePrice' && (
            <div>
              <label>Item ID : </label>
              <input
                type="number"
                value={updateItemId}
                onChange={(e) => setUpdateItemId(e.target.value)}
              />{' '}
              <br />
              <label>New Price : </label>
              <input
                type="number"
                value={updateItemPrice}
                onChange={(e) => setUpdateItemPrice(e.target.value)}
              />{' '}
              <button
                className="blue-button"
                onClick={handleUpdateItemPrice}
              >
                Update Price
              </button>{' '}
              <br /> <br />
            </div>
          )}
        </div>

        <div>
          <button
            className="blue-button"
            onClick={() => setAction('updateAvailability')}
          >
            Update Item Availability
          </button>{' '}
          <br />
          {action === 'updateAvailability' && (
            <div>
              <label>Item ID : </label>
              <input
                type="number"
                value={updateItemId}
                onChange={(e) => setUpdateItemId(e.target.value)}
              />{' '}
              <br />
              <label>Available : </label>
              <input
                type="number"
                value={updateItemAvailability}
                onChange={(e) =>
                  setUpdateItemAvailability(e.target.value)
                }
              />{' '}
              <br />
              <button
                className="blue-button"
                onClick={handleUpdateItemAvailability}
              >
                Update Availability
              </button>{' '}
              <br /> <br />
            </div>
          )}
        </div>

        <div>
        <button
          className="blue-button"
          onClick={() => setAction('viewItem')}
        >
          View Menu Item
        </button>{' '}
        <br />
        {action === 'viewItem' && (
          <div>
            <label>Item ID : </label>
            <input
              type="number"
              value={menuItemDetails.id}
              onChange={(e) => setMenuItemDetails({ ...menuItemDetails, id: e.target.value })}
            />
            &nbsp; &nbsp;
            <button
              className="blue-button"
              onClick={() => handleViewMenuItem(menuItemDetails.id)}
            >
              View Item
            </button>
            <div>
              <strong>Item Name:</strong> {menuItemDetails.name}
            </div>
            <div>
              <strong>Item Price:</strong> {menuItemDetails.price}
            </div>
            <div>
              <strong>Item Availability:</strong>{' '}
              {menuItemDetails.available}
            </div>
          </div>
        )}
      </div>

        <div>
  <button
    className="blue-button"
    onClick={() => {
      setAction('viewMenu');
      handleViewMenu();
    }}
  >
    View Menu
  </button>{' '}
    <br />
    {action === 'viewMenu' && (
      <div>
        <div>
          {/* Display the menu details here */}
          <strong>Item IDs:</strong> {menuDetails.itemIds.join(', ')}
        </div>
        <div>
          <strong>Item Names:</strong> {menuDetails.itemNames.join(', ')}
        </div>
        <div>
          <strong>Item Prices:</strong> {menuDetails.itemPrices.join(', ')}
        </div>
        <div>
          <strong>Item Availabilities:</strong>{' '}
          {menuDetails.itemAvailabilities.join(', ')}
        </div>
      </div>
    )}
</div>

        <div>
          <button className="button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CafeteriaStaffDashboard;
