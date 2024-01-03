// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ onUserTypeSelect }) => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    onUserTypeSelect && onUserTypeSelect(type);
  };

  const handleButtonClick = (type) => {
    handleUserTypeSelect(type);
    if (type === 'staff') {
      navigate('/CafeteriaStaffDashboard');
    } else if (type === 'user') {
      navigate('/CafeteriaUserDashboard');
    }
  };

  return (
    <div className="home-page">
      <h2>Welcome to Cafeteria APP</h2>
      <button className="button-primary" onClick={() => handleButtonClick('staff')}>Cafeteria Staff Dashboard</button>
      <br/> <br/>
      <button className="button-primary" onClick={() => handleButtonClick('user')}>Cafeteria User Dashboard</button>
    </div>
  );
};

export default HomePage;