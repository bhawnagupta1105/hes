import React, { useState, useEffect } from 'react';
import './Footer.css';
import { getapiversion } from '../ApiServices/api';

const Footer = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const versionData = await getapiversion();
        setVersion(versionData.version || 'N/A');
      } catch (error) {
        console.error('Error fetching version:', error);
      }
    };
    fetchVersion();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
           <span>&copy; All Rights Reserved By Genus Power Infrastructures Ltd</span>
         
        </div>
        <div className="footer-right">
          <span>Version: {version}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;