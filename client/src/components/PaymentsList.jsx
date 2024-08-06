import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PaymentsList = () => {
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [printBtn, setPrintBtn] = useState(false);
  const [filters, setFilters] = useState({
    billingFirstName: '',
    billingLastName: '',
    orderNumber: '',
    dateOrdered: '',
  });

  useEffect(() => {
    if (selectedInvoices.length > 0) {
      setPrintBtn(true);
    } else {
      setPrintBtn(false);
    }
  }, [selectedInvoices]);

  useEffect(() => {
    fetchInvoicesQuotes();
  }, [filters]);

  const fetchInvoicesQuotes = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setLoading(false);
      const reversedData = data.data.reverse();
      setInvoicesQuotes(reversedData);
    } catch (error) {
      console.error('Error fetching invoices and quotes:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDelete = async (uniqueKey) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this item?`);
    if (!isConfirmed) {
      return; // If the user cancels, do nothing
    }
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/deleteInvoiceQuote`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKey }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete data');
      }
      setInvoicesQuotes(invoicesQuotes.filter(item => item.uniqueKey !== uniqueKey));
    } catch (error) {
      console.error('Error deleting invoice/quote:', error);
    }
  };

  const handleSelectInvoice = (uniqueKey) => {
    if (selectedInvoices.includes(uniqueKey)) {
      setSelectedInvoices(selectedInvoices.filter(key => key !== uniqueKey));
    } else {
      setSelectedInvoices([...selectedInvoices, uniqueKey]);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="ml-60 mr-5 mt-32">
      <div className="container p-6 mx-auto bg-white rounded-lg shadow-xl my-5 border-b-slate-300 border-solid border-2 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5]">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold mb-4">All Payments</h1>
          <div className="flex justify-between items-center">


            <NavLink exact to="/uploadpaymentspage"
              className="py-2 bg-gradient-to-r from-blue-200 to-blue-300 border-2 border-blue-300 active:text-black text-black font-semibold rounded-md hover:scale-105 px-8 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Upload
            </NavLink>

          </div>
        </div>

        <div className="mb-4">
          {/* <input
            type="text"
            name="billingFirstName"
            placeholder="Filter by Billing First Name"
            value={filters.billingFirstName}
            onChange={handleFilterChange}
            className="border border-gray-300 px-4 py-2 rounded mr-2"
          /> */}
          {/* <input
            type="text"
            name="billingLastName"
            placeholder="Filter by Billing Last Name"
            value={filters.billingLastName}
            onChange={handleFilterChange}
            className="border border-gray-300 px-4 py-2 rounded mr-2"
          /> */}
          <label className='text-lg'>Search: </label>
          <input
            type="text"
            name="orderNumber"
            // placeholder="Filter by Order Number"
            placeholder="Search By Invoice/Quote Number"
            value={filters.orderNumber}
            onChange={handleFilterChange}
            className="border border-gray-300 px-4 py-2 rounded mr-2 w-1/3"
          />
          {/* <input
                        type="date"
                        name="dateOrdered"
                        value={filters.dateOrdered}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-4 py-2 rounded"
                    /> */}
        </div>

        {loading && (
          <div className="my-4 bg-blue-200 text-green-800 py-2 px-4 rounded">
            Loading Invoices ...
          </div>
        )}

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 rounded-md py-20">
              {/* <th className="border border-gray-300 px-4 py-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedInvoices(invoicesQuotes.map(invoice => invoice.uniqueKey));
                                        } else {
                                            setSelectedInvoices([]);
                                        }
                                    }}
                                    checked={selectedInvoices.length === invoicesQuotes.length}
                                />
                            </th> */}
              <th className="border border-gray-300 px-4 py-2">Order Number</th>
              <th className="border border-gray-300 px-4 py-2">Payment Date</th>
              <th className="border border-gray-300 px-4 py-2">Payment Amount</th>
              <th className="border border-gray-300 px-4 py-2">Payment Method</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
              {/* <th className="border border-gray-300 px-4 py-2">Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {invoicesQuotes.flatMap(invoiceQuote =>
              invoiceQuote.payments.map((payment, index) => (
                <tr key={`${invoiceQuote._id}-${index}`} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                  {/* <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectInvoice(invoiceQuote.uniqueKey)}
                                            checked={selectedInvoices.includes(invoiceQuote.uniqueKey)}
                                        />
                                    </td> */}
                  <td className="border border-gray-300 px-4 py-2">{invoiceQuote.orderNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(payment.datePaid)}</td>
                  <td className="border border-gray-300 px-4 py-2">${payment.orderPaymentAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.paymentMethod}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/Edit/${invoiceQuote.uniqueKey}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mb-[60vh]"></div>
      </div>
    </div>
  );
};

export default PaymentsList;

