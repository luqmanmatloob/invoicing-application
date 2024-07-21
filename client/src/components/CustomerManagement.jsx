import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    primaryContactFirstName: '',
    primaryContactLastName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    accountNumber: '',
    website: '',
    notes: '',
    billingCurrency: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCountry: '',
    billingState: '',
    billingCity: '',
    billingPostal: '',
    shippingName: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCountry: '',
    shippingState: '',
    shippingCity: '',
    shippingPostal: '',
    shippingPhone: '',
    shippingDeliveryInstructions: '',
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const toggleCustomerDetails = () => {
    if (showCustomerDetails) {
      setShowCustomerDetails(false);
    } else {
      setShowCustomerDetails(true);
    }
  };



  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/customer`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  // Save or update customer
  const saveCustomer = async () => {
    try {
      let response;
      if (editMode) {
        response = await fetch(`${BASE_URL}/api/customer/${selectedCustomerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        });
      } else {
        response = await fetch(`${BASE_URL}/api/customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        });
      }
      if (!response.ok) {
        throw new Error('Failed to save customer');
      }
      setEditMode(false);
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Delete customer
  const deleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/customer/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const clearBtn = () => {
    setEditMode(false);
    setNewCustomer({
      name: '',
      primaryContactFirstName: '',
      primaryContactLastName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      accountNumber: '0000',
      website: '',
      notes: '',
      billingCurrency: '',
      billingAddress1: '',
      billingAddress2: '',
      billingCountry: '',
      billingState: '',
      billingCity: '',
      billingPostal: '',
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCountry: '',
      shippingState: '',
      shippingCity: '',
      shippingPostal: '',
      shippingPhone: '',
      shippingDeliveryInstructions: '',
    });
  }

  return (
    <div className="ml-40 mt-16">
      <div className="max-w-4xl min-h-screen mx-auto bg-white rounded-lg shadow-xl p-8 border-b-slate-300 border-solid border-2 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5]">
        <h2 className="text-2xl font-bold mb-4 text-[#2b6bb9]">Customer Management</h2>

        {/* Contact Information */}
        <div className="bg-white p-4 border-b-4 border-blue-300 mb-10 pb-10">
          <h3 className="text-lg font-semibold mb-2">Contact Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                name="primaryContactFirstName"
                value={newCustomer.primaryContactFirstName}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                name="primaryContactLastName"
                value={newCustomer.primaryContactLastName}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="primaryContactEmail"
                value={newCustomer.primaryContactEmail}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="tel"
                name="primaryContactPhone"
                value={newCustomer.primaryContactPhone}
                onChange={handleInputChange}
                className="mt-1  p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Website:</label>
              <input
                type="text"
                name="website"
                value={newCustomer.website}
                onChange={handleInputChange}
                className="block  p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Personal Note:</label>
              <textarea
                name="notes"
                value={newCustomer.notes}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white p-4 border-b-4 border-blue-300 mb-10 pb-10">
          <h3 className="text-lg font-semibold mb-2">Billing Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Currency:</label>
              <input
                type="text"
                name="billingCurrency"
                value={newCustomer.billingCurrency}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Billing Address:</label>
              <input
                type="text"
                name="billingAddress1"
                value={newCustomer.billingAddress1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
              <input
                type="text"
                name="billingAddress2"
                value={newCustomer.billingAddress2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">City:</label>
              <input
                type="text"
                name="billingCity"
                value={newCustomer.billingCity}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">State:</label>
              <input
                type="text"
                name="billingState"
                value={newCustomer.billingState}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">Postal Code:</label>
              <input
                type="text"
                name="billingPostal"
                value={newCustomer.billingPostal}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Country:</label>
              <input
                type="text"
                name="billingCountry"
                value={newCustomer.billingCountry}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white p-4">
          <h3 className="text-lg font-semibold mb-2 ">Shipping Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                name="shippingName"
                value={newCustomer.shippingName}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Shipping Address:</label>
              <input
                type="text"
                name="shippingAddress1"
                value={newCustomer.shippingAddress1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
              <input
                type="text"
                name="shippingAddress2"
                value={newCustomer.shippingAddress2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">City:</label>
              <input
                type="text"
                name="shippingCity"
                value={newCustomer.shippingCity}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">State:</label>
              <input
                type="text"
                name="shippingState"
                value={newCustomer.shippingState}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">Postal Code:</label>
              <input
                type="text"
                name="shippingPostal"
                value={newCustomer.shippingPostal}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Country:</label>
              <input
                type="text"
                name="shippingCountry"
                value={newCustomer.shippingCountry}
                onChange={handleInputChange}
                className="mt-1  p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="tel"
                name="shippingPhone"
                value={newCustomer.shippingPhone}
                onChange={handleInputChange}
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Delivery Instructions:</label>
              <textarea
                name="shippingDeliveryInstructions"
                value={newCustomer.shippingDeliveryInstructions}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 p-2  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end mr-6'>
          <button
            onClick={saveCustomer}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {editMode ? 'Update' : 'Add'} Customer
          </button>
          <button onClick={clearBtn}
            className="border-blue-500 border-2 hover:bg-blue-300 text-black font-bold py-2 px-4 rounded mr-2"

          >
            Clear
          </button>
        </div>


        {/* Customer List */}


        <div className="flex justify-center border-t-4 mt-16 border-blue-300">

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-[#2b6bb9]">Customer List:</h3>

            {/* <li className="py-4 flex gap-5 items-center justify-between">
              <div className='flex gap-5'>
                <div className="font-semibold">Name</div>
                <div className="text-gray-600">Email</div>
                <div className="text-gray-600">Address1</div>
              </div>
            </li> */}

            <ul className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <li key={customer._id} className="py-4 flex gap-5 items-center justify-between">
                  <div className='flex gap-5'>
                    <div className="font-semibold">{customer.primaryContactFirstName} {customer.primaryContactLastName}</div>
                    <div className="text-gray-600">{customer.primaryContactEmail}</div>
                    <div className="text-gray-600">{customer.billingAddress1}</div>
                    <div className={showCustomerDetails ? 'flex' : 'hidden'}>


                      <div
                        className="fixed z- ml-60 top-28 right-20 left-0 bottom-14 bg-white rounded-lg shadow-2xl p-10  border-b-slate-300 border-solid border-2 border-r-[#6539c0] border-l-[#6539c0] overflow-auto"
                        style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.10)`, }}
                      >

                        <button type="button"
                          // className=" bg-red-500  rounded-md px-3 py-1 font-semibold text-lg text-white"
                          className="absolute top-5 right-5 text-red-400 hover:bg-red-6 border-[1px] hover:font-extrabold border-red-400 m-1 font-semibold px-4 py-1 rounded"

                          onClick={toggleCustomerDetails}>
                          X
                        </button>

                        <div className='flex gap-32 justify- items-center my-5'>

                          <div className=''>
                            <div className="text-black font-semibold text-xl uppercase mb-2">Contact </div>
                            <div className="text-gray-600">{customer.primaryContactFirstName} {customer.primaryContactLastName}</div>
                            <div className="text-gray-600">{customer.primaryContactEmail}</div>
                            <div className="text-gray-600">e{customer.primaryContactPhone}</div>

                          </div>

                          <div className=''>
                            <div className="text-black font-semibold text-xl uppercase ">Shipping Instructions </div>

                            <div className="text-gray-600 max-w-md">Shipping Instructions: {customer.shippingDeliveryInstructions}</div>


                          </div>
                        </div>

                        <div className='flex gap-[90px] justify- items-center my-5'>
                          <div>
                            <div className="text-black font-semibold text-xl uppercase ">Billing </div>
                            <div className="text-gray-600">Billing Currency: {customer.billingCurrency}</div>
                            <div className="text-gray-600">Billing Address  1: {customer.billingAddress1}</div>
                            <div className="text-gray-600">Billing Address2: {customer.billingAddress2}</div>
                            <div className="text-gray-600">Billing City: {customer.billingCity}</div>
                            <div className="text-gray-600">Billing State: {customer.billingState}</div>
                            <div className="text-gray-600">Billing Country: {customer.billingCountry}</div>
                            <div className="text-gray-600">Billing Postal: {customer.billingPostal}</div>

                          </div>


                          <div>
                            <div className="text-black font-semibold text-xl uppercase ">Shipping </div>

                            <div className="text-gray-600">Shipping Name: {customer.shippingName}</div>
                            <div className="text-gray-600">Shipping Address1: {customer.shippingAddress1}</div>
                            <div className="text-gray-600">Shipping Address2: {customer.shippingAddress2}</div>
                            <div className="text-gray-600">Shipping City: {customer.shippingCity}</div>
                            <div className="text-gray-600">Shipping State: {customer.shippingState}</div>
                            <div className="text-gray-600">Shipping Country: {customer.shippingCountry}</div>
                            <div className="text-gray-600">Shipping Postal: {customer.shippingPostal}</div>


                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedCustomerId(customer._id);
                        setNewCustomer({
                          ...customer,
                          primaryContactFirstName: customer.primaryContactFirstName || '',
                          primaryContactLastName: customer.primaryContactLastName || '',
                          primaryContactEmail: customer.primaryContactEmail || '',
                          primaryContactPhone: customer.primaryContactPhone || '',
                          accountNumber: customer.accountNumber || '',
                          website: customer.website || '',
                          notes: customer.notes || '',
                          billingCurrency: customer.billingCurrency || '',
                          billingAddress1: customer.billingAddress1 || '',
                          billingAddress2: customer.billingAddress2 || '',
                          billingCountry: customer.billingCountry || '',
                          billingState: customer.billingState || '',
                          billingCity: customer.billingCity || '',
                          billingPostal: customer.billingPostal || '',
                          shippingName: customer.shippingName || '',
                          shippingAddress1: customer.shippingAddress1 || '',
                          shippingAddress2: customer.shippingAddress2 || '',
                          shippingCountry: customer.shippingCountry || '',
                          shippingState: customer.shippingState || '',
                          shippingCity: customer.shippingCity || '',
                          shippingPostal: customer.shippingPostal || '',
                          shippingPhone: customer.shippingPhone || '',
                          shippingDeliveryInstructions: customer.shippingDeliveryInstructions || '',
                        });
                        window.scrollTo(0, 0);


                      }}
                      className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer._id)}
                      className=" text-gray-900 border-gray-900 border-[1px]  hover:red hover:border-red-400 hover:text-red-500 m-1 font-bold px-4 py-1 rounded"

                    >
                      Delete
                    </button>

                    <button
                      onClick={toggleCustomerDetails}
                      className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 ml-2 rounded mr-2"
                    >
                      Details
                    </button>

                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerManagement;
