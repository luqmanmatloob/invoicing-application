import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print';

import Company from './Company'

const EditInvoiceQuote = ({ id }) => {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  
  const [subtotal, setSubtotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');


  const [formData, setFormData] = useState({
    type: 'invoice',
    orderNumber: '',
    dateOrdered: '',
    dateDue: '',
    orderTotal: 0,
    billingCity: '',
    billingAddress: '',
    shippingMethod: '',
    billingState: '',
    billingEmailAddress: '',
    shippingAddress: '',
    shippingCity:'',
    shippingState: '',
    shippingPostcode: '',
    items: [{
      orderNumber: '',
      productName: '',
      productCode: '',
      size: '',
      color: '',
      lineQty: 1,
      decorationProcess: '',
      unitPrice: 0,
      lineTotal: 0,
      tax: 0,
      taxExempt: false,
      orderShippingTotal: 0,
      poNumber: '',
      supplierPoNumber: '',
      productionStaffAccount: '',
      storeName: '',
      company: '',
      billingFirstName: '',
      billingLastName: '',
      billingEmailAddress: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingPostcode: '',
      billingPhoneNo: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingPostcode: '',
      shippingPhoneNo: '',
      shippingMethod: '',
      designName: '',
      designPrice: 0
    }],
    note: 'You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.'
  });

  useEffect(() => {
    calculateTotals();
  }, [formData.items]);



  useEffect(() => {
    const fetchInvoiceQuote = async () => {
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${BASE_URL}/api/invoicequote/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Convert MongoDB dates to HTML input type date format
        const convertDateToInputFormat = (mongoDate) => {
          const dateObj = new Date(mongoDate);
          const year = dateObj.getFullYear();
          let month = (1 + dateObj.getMonth()).toString().padStart(2, '0');
          let day = dateObj.getDate().toString().padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Update state with fetched data
        setFormData(prevFormData => ({
          ...prevFormData,
          type: data.type || 'invoice',
          orderNumber: data.orderNumber || '',
          dateOrdered: data.dateOrdered ? convertDateToInputFormat(data.dateOrdered) : '',
          dateDue: data.dateDue ? convertDateToInputFormat(data.dateDue) : '',
          orderTotal: data.orderTotal || 0,
          billingCity: data.billingCity || '',
          billingAddress: data.billingAddress || '',
          billingState: data.billingState || '',
          billingEmailAddress: data.billingEmailAddress || '',
          shippingAddress: data.shippingAddress || '',
          shippingCity: data.shippingCity || '',
          shippingState: data.shippingState || '',
          shippingPostcode: data.shippingPostcode || '',
          shippingMethod: data.shippingMethod || '',
          items: data.items || [{
            orderNumber: '',
            productName: '',
            productCode: '',
            size: '',
            color: '',
            lineQty: 1,
            decorationProcess: '',
            unitPrice: 0,
            lineTotal: 0,
            tax: 0,
            taxExempt: false,
            orderShippingTotal: 0,
            poNumber: '',
            supplierPoNumber: '',
            productionStaffAccount: '',
            storeName: '',
            company: '',
            billingFirstName: '',
            billingLastName: '',
            billingEmailAddress: '',
            billingAddress: '',
            billingCity: '',
            billingState: '',
            billingPostcode: '',
            billingPhoneNo: '',
            shippingFirstName: '',
            shippingLastName: '',
            shippingAddress: '',
            shippingCity: '',
            shippingState: '',
            shippingPostcode: '',
            shippingPhoneNo: '',
            shippingMethod: '',
            designName: '',
            designPrice: 0
          }],
          note: data.note || 'You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.'
        }));

      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state or display error message
      }
    };

    fetchInvoiceQuote();

  }, [id]); // Fetch data when id changes








  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  };


  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedItems = [...formData.items];
    // Remove the 'items[index].' part from the name
    const key = name.replace(`items[${index}].`, "");

    // Handle checkbox separately
    if (type === 'checkbox') {
      updatedItems[index] = { ...updatedItems[index], [key]: checked };
    } else {
      updatedItems[index] = { ...updatedItems[index], [key]: value };
    }

    // Auto-calculate lineTotal if unitPrice, lineQty, or tax changes
    if (["unitPrice", "lineQty", "tax", "taxExempt"].includes(key)) {
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      const lineQty = parseInt(updatedItems[index].lineQty) || 0;
      const tax = parseFloat(updatedItems[index].tax) || 0;
      const taxExempt = updatedItems[index].taxExempt;
      const lineTotal = lineQty * unitPrice;
      const taxAmount = taxExempt ? 0 : (lineTotal * tax) / 100;
      updatedItems[index].lineTotal = lineTotal + taxAmount;
    }

    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
  };


  // const calculateTotals = () => {
  //   let subtotal = 0;
  //   let totalTax = 0;
  //   formData.items.forEach((item) => {
  //     const unitPrice = parseFloat(item.unitPrice) || 0;
  //     const lineQty = parseInt(item.lineQty) || 0;
  //     const lineTotal = unitPrice * lineQty;
  //     const tax = parseFloat(item.tax) || 0;
  //     const taxExempt = item.taxExempt;
  //     const taxAmount = taxExempt ? 0 : (lineTotal * tax) / 100;

  //     subtotal += lineTotal;
  //     totalTax += taxAmount;
  //   });
  //   setSubtotal(subtotal);
  //   setTotalTax(totalTax);
  //   setGrandTotal(subtotal + totalTax);

  //   const computedOrderTotal = grandTotal;
  //   console.log(`grandtotal ${grandTotal}`)
  //   console.log(`computedordertotal ${computedOrderTotal}`)
  //   const updatedFormData = { ...formData, orderTotal: computedOrderTotal };
  //   setFormData(updatedFormData);

  // };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    formData.items.forEach((item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const lineQty = parseInt(item.lineQty) || 0;
      const lineTotal = unitPrice * lineQty;
      const tax = parseFloat(item.tax) || 0;
      const taxExempt = item.taxExempt;
      const taxAmount = taxExempt ? 0 : (lineTotal * tax) / 100;
  
      subtotal += lineTotal;
      totalTax += taxAmount;
    });
  
    setSubtotal(subtotal);
    setTotalTax(totalTax);
    const computedOrderTotal = subtotal + totalTax; // Calculate grand total here
    setGrandTotal(computedOrderTotal); // Update grand total state
  
    // Update form data with the calculated total
    const updatedFormData = { ...formData, orderTotal: computedOrderTotal };
    setFormData(updatedFormData);
  };
  
  const addItem = () => {
    const newItems = [...formData.items, {
      orderNumber: '',
      productName: '',
      productCode: '',
      size: '',
      color: '',
      lineQty: 1,
      decorationProcess: '',
      unitPrice: 0,
      lineTotal: 0,
      tax: 0,
      taxExempt: false,
      orderShippingTotal: 0,
      poNumber: '',
      supplierPoNumber: '',
      productionStaffAccount: '',
      storeName: '',
      company: '',
      billingFirstName: '',
      billingLastName: '',
      billingEmailAddress: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingPostcode: '',
      billingPhoneNo: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingPostcode: '',
      shippingPhoneNo: '',
      shippingMethod: '',
      designName: '',
      designPrice: 0
    }];

    const updatedFormData = { ...formData, items: newItems };
    setFormData(updatedFormData);
  };


  






  const BASE_URL = process.env.REACT_APP_BASE_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Invoice updated successfully:', data);
      setResponseMessage('Invoice updated successfully.');
  
      setTimeout(() => {
        setResponseMessage('');
      }, 1000);
  
    } catch (error) {
      console.error('Error updating invoice:', error);
      setResponseMessage('Error');
  
      setTimeout(() => {
        setResponseMessage('');
      }, 1000);
    }
  };
  













  return (
    <div className='' ref={componentRef}>
      <form
        className="relative flex flex-col px-2 md:flex-row"
        onSubmit={handleSubmit}            >
        <div className="my-6 flex-1 space-y-2  rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6">

          {/* row 1 compnay info and invoice infor */}
          <div className='flex justify-between w-full border-b'>

            <div >
              <Company />
            </div>
            <div>
              <div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="text-xl font-semibold borde rounded px-2 py-1 w-full"
                >
                  {/* <option value="">Select</option> */}
                  <option value="invoice">Invoice</option>
                  <option value="quote">Quote</option>
                </select>
              </div>
              <div className="flex min-w-[100px] items-center ">
                <label className="min-w-24 ">Invoice_No: </label> {/*Order Number*/}
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  placeholder='Invoice no'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <label className="min-w-24 ">Order_Date: </label>
                <input
                  type="date"
                  name="dateOrdered"
                  placeholder='Order Date'
                  value={formData.dateOrdered}
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <label className="min-w-24 ">Due_Date: </label>
                <input
                  type="date"
                  name="dateDue"
                  placeholder='Due Date'
                  value={formData.dateDue}
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <label className="min-w-24">Shipping: </label>
                <input
                  type="text"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  placeholder='Shipping Method'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              {/*                                 
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">Invoice_No: </label> 
                                    <input
                                        type="text"
                                        name="orderNumber"
                                        value={formData.trackingid}
                                        placeholder='Invoice no'
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"
                                        required
                                    />
                                </div>*/}



            </div>

          </div>

          {/* row 2, billing adress and shipping adress  city statecounty email adress */}
          <div className='flex justify-between px-5 border-b'>



            <div>

              <p className='p-2 text-lg font-semibold'>Billing Address</p>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  placeholder='Address'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="billingCity"
                  value={formData.billingCity}
                  placeholder='City'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="billingState"
                  value={formData.billingState}
                  placeholder='State'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              {/* <div className="flex min-w-[100px] items-center "> country
                                <input
                                    type="text"
                                    name="shippingMethod"
                                    value={formData.billing}
                                    placeholder='Shipping Method'
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full"
                                    required
                                />
                            </div> */}
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="billingEmailAddress"
                  value={formData.billingEmailAddress}
                  placeholder='Email '
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>

            </div>



            <div>
              <p className='p-2 text-lg font-semibold'>Shipping Address</p>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  placeholder='Address'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  placeholder='City'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="shippingState"
                  value={formData.shippingState}
                  placeholder='State'
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>
              {/* <div className="flex min-w-[100px] items-center "> country
                                <input
                                    type="text"
                                    name="shippingMethod"
                                    value={formData.billing}
                                    placeholder='Shipping Method'
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full"
                                    required
                                />
                            </div> */}
              <div className="flex min-w-[100px] items-center ">
                <input
                  type="text"
                  name="shippingPostcode"
                  value={formData.shippingPostcode}
                  placeholder='Postcode '
                  onChange={handleChange}
                  className="px-2 py-1 w-full"
                  required
                />
              </div>

            </div>



          </div>


          {/* row 3 items  product, color, size/qty, unit price, tax, qty, total, tax exempt  */}
          <div className='flex justify-between px-5 border-b '>


            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Items</h3>
              <div className="grid grid-cols-9 gap-4 mb-4">
                <p>Product </p>
                <p>Color:
                </p>
                <p>Size:
                </p>
                <p>Quantity:
                </p>
                <p>Unit Price:</p>
                <p>{'Tax (%):'}</p>
                <p>Tax Exempt:</p>
                <p>Total:</p>

              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-9 gap-4">
                  {/* Product Name */}
                  <div>
                    {/* <label className="block mb-2">Product Name:</label> */}
                    <input
                      type="text"
                      name={`items[${index}].productName`}
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      placeholder='Name'
                      required
                    />
                  </div>
                  {/* Color */}
                  <div>
                    {/* <label className="block mb-2">Color:</label> */}
                    <input
                      type="text"
                      name={`items[${index}].color`}
                      value={item.color}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      placeholder='Color'
                      required
                    />
                  </div>
                  {/* Size */}
                  <div>
                    {/* <label className="block mb-2">Size:</label> */}
                    <input
                      type="text"
                      name={`items[${index}].size`}
                      value={item.size}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      placeholder='Size'
                      required
                    />
                  </div>
                  {/* Quantity */}
                  <div>
                    {/* <label className="block mb-2">Quantity:</label> */}
                    <input
                      type="number"
                      name={`items[${index}].lineQty`}
                      value={item.lineQty}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  {/* Unit Price */}
                  <div>
                    {/* <label className="block mb-2">Unit Price:</label> */}
                    <input
                      type="number"
                      name={`items[${index}].unitPrice`}
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  {/* Tax */}
                  <div>
                    {/* <label className="block mb-2">Tax (%):</label> */}
                    <input
                      type="number"
                      name={`items[${index}].tax`}
                      value={item.tax}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                    />
                  </div>
                  {/* Tax Exempt */}
                  <div>
                    {/* <label className="block mb-2">Tax Exempt:</label> */}
                    <input
                      type="checkbox"
                      name={`items[${index}].taxExempt`}
                      checked={item.taxExempt}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1"
                    />
                  </div>
                  {/* Total (Auto Calculated) */}
                  <div>
                    {/* <label className="block mb-2">Total:</label> */}
                    <input
                      type="number"
                      name={`items[${index}].lineTotal`}
                      value={item.lineTotal}
                      readOnly
                      className="rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 hover:bg-red-600 m-1 text-white px-4 py-1 rounded"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="my-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
              >
                Add Item
              </button>
            </div>



          </div>


          {/* row 4 message,  sub total,  tax, grand total  */}
          <div className="flex justify-between gap-5 items-start px-5 border-b">
            <div className="mt-4 w-full sm:w-[500px] ">
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="rounded px-2 py-1 w-full h-32"
              ></textarea>
            </div>
            <div className="mt-4 w-full sm:w-1/2 flex flex-col space-y-4">
              <div className="flex justify-end items-center gap-3">
                <label className="block mb-2 ">Subtotal:</label>
                <input
                  type="number"
                  value={subtotal}
                  name='subtotal'
                  onChange={handleChange}
                  readOnly
                  className=" rounded px-2 py-1 w-1/2"
                />
              </div>
              <div className="flex justify-end items-center gap-3">
                <label className="block mb-2 ">Total Tax:</label>
                <div className="flex w-1/2 items-center">
                  <input
                    type="number"
                    value={totalTax}
                    name='totalTax'
                    readOnly
                    onChange={handleChange}
                    className=" rounded px-2 py-1 w-full"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div className="flex justify-end items-center gap-3">
                <label className="block mb-2 ">Grand Total:</label>
                <input
                  type="number"
                  name='grandTotal'
                  value={grandTotal}
                  onChange={handleChange}
                  readOnly
                  className=" rounded px-2 py-1 w-1/2"
                />
              </div>
            </div>
          </div>



          <div className='pt-10 px-5'>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2  rounded"
            >
              Update
            </button>

            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mx-3"
            >
              Print
            </button>
            {responseMessage && (
              <span className={`mt-4 ${responseMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {responseMessage}
              </span>
            )}

          </div>


        </div>
      </form>

    </div>
  )
}

export default EditInvoiceQuote
