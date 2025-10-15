// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from "../src/Header/Navbar";
import Cards from './Dashboard/Cards/Cards';
import './index.css'
import MyBar from './Dashboard/Charts';
import Dashboard from './Dashboard/Dashboard';
import Shimmer from './Shimmer';
import Footer from './Footer/Footer';
//import { Dashboard } from '@mui/icons-material';
//import RadioButton from './Dashboard/RadioButton';
//import { loadConfig } from '../src/config';

import ReportWithPreview from './Dashboard/ReportWithPreview';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasData(true); // Set to false to show shimmer when no data
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !hasData) {
    return <Shimmer />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Dashboard></Dashboard>
        <MyBar data></MyBar>
      </main>
      <Footer />
    </div>
  );
}

export default App;
