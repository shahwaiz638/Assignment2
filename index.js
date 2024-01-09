// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './app';
import CafeteriaStaffDashboard from './CafeteriaStaffDashboard';
import CafeteriaUserDashboard from './CafeteriaUserDashboard';
import HomePage from './HomePage'; // Import HomePage component
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/CafeteriaStaffDashboard" element={<CafeteriaStaffDashboard />} />
          <Route path="/CafeteriaUserDashboard" element={<CafeteriaUserDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);
