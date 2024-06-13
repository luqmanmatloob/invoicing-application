import React, { useState, useEffect } from 'react';

const Company = () => {
  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    url: ''
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch current settings when the component mounts
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      // Set the settings from the fetched data
      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        url: data.url || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{settings.companyName}</h1>
      <div className="flex flex-col space-y-2">
        <p>{settings.companyName} - {settings.phoneNumber}</p>
        <p> {settings.address}</p>
        <p>{settings.city}, {settings.state}</p>
        <p>{settings.country}</p>
        {/* <p><a href={settings.url} target='_blank' className="text-blue-500">{settings.url}</a></p> */}
        <p className="">{settings.url}</p>
      </div>
    </div>
  );
}

export default Company;
