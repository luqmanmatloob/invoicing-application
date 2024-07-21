import React from "react";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import Company from "./Company";

const Invoice = () => {


  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  const [formData, setFormData] = useState({
    type: "invoice",
    orderNumber: "",
    dateOrdered: "",
    dateDue: "",
    orderTotal: 0,

    billingCity: "",
    billingAddress: "",
    billingState: "",
    billingEmailAddress: "",
    shippingAddress: "",
    shippingCity: "",
    shippingMethod: "",
    paymentMethod: "",
    shippingAddress: "",
    shippingState: "",
    shippingPostcod: "",

    items: [
      {
        orderNumber: "",
        productName: "",
        productCode: "",
        size: "",
        color: "",
        lineQty: 1,
        decorationProcess: "",
        unitPrice: 0,
        lineTotal: 0,
        tax: 0,
        taxExempt: false,
        orderShippingTotal: 0,
        poNumber: "",
        supplierPoNumber: "",
        productionStaffAccount: "",
        storeName: "",
        company: "",
        billingFirstName: "",
        billingLastName: "",
        billingEmailAddress: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingPostcode: "",
        billingPhoneNo: "",
        shippingFirstName: "",
        shippingLastName: "",
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingPostcode: "",
        shippingPhoneNo: "",
        shippingMethod: "",
        designName: "",
        designPrice: 0,
      },
    ],
    payments:
      [
        {
          amount: "",
          date: "",
          reference: "", //for any credit card or banking information
          note: "",
          otherType: "", //text area for any other type of paymen
          paymentMethod: "", // Payment method specific to each payment
          type: "" //{ type: String, enum: ['deposit', 'on_delivery', 'other'], default: 'other' } // Add type field

        },
      ],
    note: "You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.",
  });






  const [subtotal, setSubtotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [invoiceNoLbl, setinvoiceNoLbl] = useState('Invoice No')
  const [editPayments, setEditPayments] = useState(false)
  const [totalPayments, setTotalPayments] = useState(1)


  useEffect(() => {
    if (formData.type === 'invoice') {
      setinvoiceNoLbl('Invoice No');
    } else if (formData.type === 'quote') {
      setinvoiceNoLbl('Quote No');
    }
  }, [formData.type]);



  useEffect(() => {
    calculateTotals();
  }, [formData.items, grandTotal]);



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
    if (type === "checkbox") {
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
      let lineTotal = lineQty * unitPrice;
      lineTotal = taxExempt ? lineTotal : (lineTotal + tax * lineQty);
      updatedItems[index].lineTotal = lineTotal;
    }

    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
  };















  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPayments = [...formData.payments];
    const key = name.replace(`payments[${index}].`, "");

    updatedPayments[index] = {
      ...updatedPayments[index],
      [key]: value
    };

    const updatedFormData = { ...formData, payments: updatedPayments };
    setFormData(updatedFormData);
    console.log(updatedFormData)
  };

  const addPayment = () => {
    const newPayment = {
      amount: '',
      date: '',
      method: '',
      reference: '',
      note: '',
      otherType: '',
      paymentMethod: '',
      type: ''
    };
    const updatedPayments = [...formData.payments, newPayment];
    setFormData({ ...formData, payments: updatedPayments });
    setTotalPayments(totalPayments + 1)

  };

  const removePayment = (index) => {
    const updatedPayments = [...formData.payments];
    updatedPayments.splice(index, 1);
    setFormData({ ...formData, payments: updatedPayments });
    setTotalPayments(totalPayments - 1)

  };





























  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    formData.items.forEach((item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const lineQty = parseInt(item.lineQty) || 0;
      const lineTotal = unitPrice * lineQty;
      const tax = parseFloat(item.tax) || 0;
      const taxExempt = item.taxExempt;
      const taxAmount = taxExempt ? 0 : (lineQty * tax);

      subtotal += lineTotal;
      totalTax += taxAmount;
    });
    setSubtotal(subtotal);
    setTotalTax(totalTax);
    setGrandTotal(subtotal + totalTax);

    const computedOrderTotal = grandTotal;
    // console.log(`grandtotal ${grandTotal}`)
    // console.log(`computedordertotal ${computedOrderTotal}`)

    const updatedFormData = { ...formData, orderTotal: computedOrderTotal };
    setFormData(updatedFormData);
  };

  const addItem = () => {
    const newItems = [
      ...formData.items,
      {
        orderNumber: "",
        productName: "",
        productCode: "",
        size: "",
        color: "",
        lineQty: 1,
        decorationProcess: "",
        unitPrice: 0,
        lineTotal: 0,
        tax: 0,
        taxExempt: false,
        orderShippingTotal: 0,
        poNumber: "",
        supplierPoNumber: "",
        productionStaffAccount: "",
        storeName: "",
        company: "",
        billingFirstName: "",
        billingLastName: "",
        billingEmailAddress: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingPostcode: "",
        billingPhoneNo: "",
        shippingFirstName: "",
        shippingLastName: "",
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingPostcode: "",
        shippingPhoneNo: "",
        shippingMethod: "",
        designName: "",
        designPrice: 0,
      },
    ];

    const updatedFormData = { ...formData, items: newItems };
    setFormData(updatedFormData);
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const computedOrderTotal = grandTotal;
    // console.log(`grandtotal ${grandTotal}`)
    // console.log(`computedordertotal ${computedOrderTotal}`)

    // const updatedFormData = { ...formData, orderTotal: computedOrderTotal };
    // setFormData(updatedFormData);

    // console.log(formData)

    try {
      const response = await fetch(
        `${BASE_URL}/api/invoicequote/createInvoiceQuote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Invoice submitted successfully:", data);
      setResponseMessage(`Invoice submitted successfully.`);
      setTimeout(() => {
        setResponseMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setResponseMessage("Error");

      setTimeout(() => {
        setResponseMessage("");
      }, 1000);
    }
  };

  return (
    <div className="ml-32 mt-16">
      <div ref={componentRef} className="print-border-none print-no-shadow print-no-py .print-no-my py-6 mx-auto bg-white rounded-lg shadow-xl p-8 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5] border-solid border-2 min-w-[1000px]">
        <form
          className="print-border-none relative flex flex-col px-2 md:flex-row"
          onSubmit={handleSubmit}
        >
          <div className="print-shadow-none print-border-none print-no-py .print-no-my my-6 flex-1 space-y-2  rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6">
            {/* row 1 compnay info and invoice infor */}
            <div className="print-border-none print-border-none flex justify-between w-full border-b">
              <div>
                <Company />
              </div>
              <div className="mt-3 mb-1">
                <div className="">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="text-xl font-semibold borde rounded py-1 w-[97%]"
                  >
                    {/* <option value="">Select</option> */}
                    <option value="invoice">Invoice</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>

                <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24 ">Order Date: </label>
                  <input
                    type="date"
                    name="dateOrdered"
                    placeholder="Order Date"
                    value={formData.dateOrdered}
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24 ">Due Date: </label>
                  <input
                    type="date"
                    name="dateDue"
                    placeholder="Due Date"
                    value={formData.dateDue}
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24">Shipping: </label>
                  <input
                    type="text"
                    name="shippingMethod"
                    value={formData.shippingMethod}
                    placeholder="Shipping Method"
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24 ">{invoiceNoLbl}: </label>{" "}
                  {/*Order Number*/}
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    placeholder={invoiceNoLbl}
                    onChange={handleChange}
                    className="px-2 py-1 w-full"
                    required

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24 ">Payment:</label>{" "}
                  {/*Order Number*/}
                  <input
                    type="text"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    placeholder="payment Method"
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

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
                                          
                                    />
                                </div>*/}
              </div>
            </div>

            {/* row 2, billing adress and shipping adress  city statecounty email adress */}
            <div className="print-border-none flex justify-between px-5 border-b">
              <div>
                <p className="print-text-12px p-2 text-lg font-semibold">Billing Address</p>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    placeholder="Address"
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    placeholder="City"
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="billingState"
                    value={formData.billingState}
                    placeholder="State"
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

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
                                      
                                />
                            </div> */}
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="billingEmailAddress"
                    value={formData.billingEmailAddress}
                    placeholder="Email "
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

                  />
                </div>
              </div>

              <div>
                <p className="print-text-12px p-2 text-lg font-semibold">Shipping Address</p>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    placeholder="Address"
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    placeholder="City"
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

                  />
                </div>
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="shippingState"
                    value={formData.shippingState}
                    placeholder="State"
                    onChange={handleChange}
                    className="px-2 py-1 my-1 w-full"

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
                                      
                                />
                            </div> */}
                <div className="flex min-w-[100px] items-center ">
                  <input
                    type="text"
                    name="shippingPostcode"
                    value={formData.shippingPostcode}
                    placeholder="Postcode "
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

                  />
                </div>
              </div>
            </div>

            {/* row 3 items  product, color, size/qty, unit price, tax, qty, total, tax exempt  */}
            <div className="pt-12 print-no-py">
              <h3 className="print-no-py text-xl font-semibold mb-2 bg-gradient-to-r from-blue-200 to-blue-400  block text-Black font-Josefin-Sans uppercase px-5 py-2 rounded-md m-[-10">
                Items
              </h3>
            </div>

            <div className="print-border-none flex justify-between px-5 border-b ">
              <div className="mt-4 print-no-my">
                <div className="print-no-my print-text-12px grid grid-cols-9 gap-4 mb-4 ">
                  <p className="col-span-2" >Product </p>
                  {/* <p>Color</p> */}
                  <p className="pl-2">Size</p>
                  <p>Qty:</p>
                  <p>Unit Price</p>
                  <p className="pl-4">{"Tax"}</p>
                  <p>{`Tax Exempt`}</p>
                  <p>Total:</p>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-9 gap-4">
                    {/* Product Name */}
                    <div className="col-span-2">
                      {/* <label className="block mb-2">Product Name:</label> */}
                      <input
                        type="text"
                        name={`items[${index}].productName`}
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, e)}
                        className="rounded px-2 py-1 w-full"
                        placeholder="Name"
                        required

                      />
                    </div>
                    {/* Color */}
                    {/* <div> */}
                    {/* <label className="block mb-2">Color:</label> */}
                    {/* <input
                      type="text"
                      name={`items[${index}].color`}
                      value={item.color}
                      onChange={(e) => handleItemChange(index, e)}
                      className="rounded px-2 py-1 w-full"
                      placeholder="Color"

                    />
                  </div> */}
                    {/* Size */}
                    <div>
                      {/* <label className="block mb-2">Size:</label> */}
                      <input
                        type="text"
                        name={`items[${index}].size`}
                        value={item.size}
                        onChange={(e) => handleItemChange(index, e)}
                        className="rounded px-2 py-1 w-full"
                        placeholder="Size"

                      />
                    </div>
                    {/* Quantity */}
                    <div >
                      {/* <label className="block mb-2">Quantity:</label> */}
                      <input
                        type="number"
                        name={`items[${index}].lineQty`}
                        value={item.lineQty}
                        onChange={(e) => handleItemChange(index, e)}
                        className="rounded px-2 py-1 w-full"

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

                      />
                    </div>
                    {/* Tax */}
                    <div className="pl-4">
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
                    <div className="pl-3">
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
                        className="no-print text-red-400 hover:bg-red-6 border-[1px] border-red-400 m-1 font-semibold px-4 py-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="no-print my-3 bg-transparent border-[1px] border-blue-500  hover:bg-blue-200 hover:text-black  text-blue-700 font-semibold px-4 py-1 rounded"
                >
                  Add Item
                </button>

              </div>
            </div>

            {/* row 4 message,  sub total,  tax, grand total  */}
            <div className="print-border-none flex justify-between gap-5 items-start px-5 border-b">
              <div className="print-text-12px mt-4 w-full sm:w-[500px] ">
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="rounded px-2 py-1 w-full h-32"
                ></textarea>
              </div>

              <div className="mt-4 w-full sm:w-1/2 flex flex-col 4">
                <div className="flex justify-end items-center gap-3">
                  <label className="block mb-2 ">Subtotal:</label>
                  <input
                    type="number"
                    value={subtotal.toFixed(2)}
                    name="subtotal"
                    onChange={handleChange}
                    readOnly
                    className=" rounded px-2 py-1 w-1/2"
                  />
                </div>

                <div className=" flex justify-end items-center gap-3">
                  <label className="block mb-2 ">{`Total Tax:`}</label>
                  <div className="flex w-1/2 items-center">
                    <input
                      type="number"
                      value={totalTax.toFixed(2)}
                      name="totalTax"
                      readOnly
                      onChange={handleChange}
                      className=" rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end items-center gap-3">
                  <label className="block mb-2 ">Grand Total:</label>
                  <input
                    type="number"
                    name="grandTotal"
                    value={grandTotal.toFixed(2)}
                    onChange={handleChange}
                    readOnly
                    className=" rounded px-2 py-1 w-1/2"
                  />
                </div>
                <div className="flex justify-end items-center gap-3">
                  <label className="block mb-2 ">Payments:</label>
                  <input
                    type="number"
                    name="grandTotal"
                    value={totalPayments}
                    onChange={handleChange}
                    readOnly
                    className=" rounded px-2 py-1 w-1/2"
                  />

                </div>
                <div className="flex justify-center pr-10 mb-5">
                  <button type="button"
                    className="text-blue-500 underline"
                    onClick={() => { setEditPayments(true) }}>
                    Edit payment Plan
                  </button>

                </div>
              </div>
            </div>














            {editPayments &&

              (
                <div
                  className="fixed z-50 top-3 right-0 left-0 bottom-6 bg-white rounded-lg shadow-2xl p-10  border-b-slate-300 border-solid border-2 border-r-[#6539c0] border-l-[#6539c0] overflow-auto m-52"
                  style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)`, }}
                >

                  <button type="button"
                    className="fixed top-10 right-60 bg-red-500 rounded-md px-3 py-1 font-semibold text-lg text-white"
                    onClick={() => { setEditPayments(false) }}>
                    X
                  </button>
                  <div className="print-no-my print-text-12px grid grid-cols-9 gap-4 mb-4">


                  </div>

                  {formData.payments.map((payment, index) => (
                    <div key={index} className=" flex justify-between border-b-4 py-2">

                      <div className="flex gap-5">
                        <div className="flex flex-col gap-2 pt-1">
                          <label>Amount</label>
                          <label>Payment Date</label>
                          {/* <label>Reference</label> */}
                          <label>PaymentMethod</label>


                        </div>

                        <div>
                          <div className=''>
                            <input
                              type="number"
                              name={`payments[${index}].amount`}
                              value={payment.amount}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 w-full"
                              placeholder='Amount'
                            />
                          </div>
                          {/* Date */}
                          <div className='flex items-center justify-center'>
                            <input
                              type="date"
                              name={`payments[${index}].date`}
                              value={payment.date}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 w-full"
                              placeholder='Date'
                            />
                          </div>
                          {/* Reference */}
                          {/* <div className='flex items-center justify-center'>
                          <input
                            type="text"
                            name={`payments[${index}].reference`}
                            value={payment.reference}
                            onChange={(e) => handlePaymentChange(index, e)}
                            className="rounded px-2 py-1 w-full"
                            placeholder='Reference'
                          />
                        </div> */}
                          {/* Note */}

                          <div className='flex items-center justify-center'>
                            <input
                              type="text"
                              name={`payments[${index}].paymentMethod`}
                              value={payment.paymentMethod}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 w-full"
                              placeholder='Payment Method'
                            />
                          </div>

                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex flex-col gap-2 pt-1">
                          <label>Type</label>
                          <label>Other Type</label>
                          <label>Note</label>



                        </div>

                        <div>

                          {/* <div className='flex items-center justify-center'>
                          <input
                            type="text"
                            name={`payments[${index}].type`}
                            value={payment.type}
                            onChange={(e) => handlePaymentChange(index, e)}
                            className="rounded px-2 py-1 w-full"
                            placeholder='Type'
                          />
                        </div> */}

                          <div className="mb-2">
                            <select
                              name={`payments[${index}].type`}
                              value={payment.type}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className=""
                            >
                              <option value="deposit">Deposit</option>
                              <option value="on delivery">On Delivery</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className='flex items-center justify-center'>
                            <input
                              type="text"
                              name={`payments[${index}].otherType`}
                              value={payment.otherType}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 w-full"
                              placeholder='Other Type'
                            />
                          </div>
                          <div className='flex items-center justify-center'>
                            <textarea
                              // type="text"
                              name={`payments[${index}].note`}
                              value={payment.note}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 w-full border-2"
                            // placeholder='Note'
                            ></textarea>
                          </div>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => removePayment(index)}
                              className="no-print bg-red-500 hover:bg-red-600 m-1 text-white px-4 py-1 rounded "
                            >
                              X
                            </button>


                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPayment}
                    className="no-print my-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Add Payment
                  </button>
                </div>
              )}

























            <div className="no-print print-no-py print-no-my pt-10 px-5">
              <button
                type="submit"
                className=" bg-[#6539c0] hover:bg-purple-500 text-white px-6 py-2  rounded"
              >
                Save
              </button>

              <button
                onClick={handlePrint}
                type="button"
                className=" bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mx-3"
              >
                Print
              </button>
              {responseMessage && (
                <span
                  className={`mt-4 ${responseMessage.startsWith("Error")
                    ? "text-red-500"
                    : "text-green-500"
                    }`}
                >
                  {responseMessage}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invoice;
