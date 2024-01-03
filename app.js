// App.js
import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'; // Import your CSS file
import HomePage from './HomePage';


const App = () => {
  const navigate = useNavigate();

  // Simulate automatic navigation to HomePage on app launch
  React.useEffect(() => {
    navigate('/HomePage');
  }, [navigate]);

  const handleUserTypeSelect = (type) => {
    // Handle the user type selection logic
    console.log(`User selected type: ${type}`);
    if (type === 'staff') {
      navigate('/CafeteriaStaffDashboard');
    } else if (type === 'user') {
      navigate('/CafeteriaUserDashboard');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Cafeteria App</h1>
      </div>
      <Routes>
        {/* ... */}
      </Routes>
     
    </div>
  );
};

export default App;