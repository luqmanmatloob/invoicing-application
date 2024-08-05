const path = require("path");
const fs = require("fs");
const { InvoiceOrQuote } = require("../models/invoiceQuote");

// Helper function to parse numbers
const parseNumber = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse dates
const parseDate = (dateString, fallbackDate = new Date()) => {
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;
};






(exports.createInvoiceQuote = async (req, res) => {
    try {
      console.log(req.body);

      const {
        type,
        orderNumber,
        note,
        dateOrdered,
        dateDue,
        orderTotal,
        items,
        billingFirstName,
        billingLastName,
        billingCity,
        billingAddress,
        billingState,
        billingEmailAddress,
        shippingFirstName,
        shippingLastName,
        shippingAddress,
        shippingCity,
        shippingMethod,
        paymentMethod,
        shippingState,
        shippingPostcode,
        payments,
        paymentPaid, 
        paymentDue, 
        paymentTerms,
        paymentDates,
    
      } = req.body;

      // if (!type || !["invoice", "quote"].includes(type)) {
      //   return res
      //     .status(400)
      //     .send("Invalid type. Must be 'invoice' or 'quote'.");
      // }

      // Check if orderNumber already exists
      const existingInvoiceOrQuote = await InvoiceOrQuote.findOne({
        orderNumber,
      });
      if (existingInvoiceOrQuote) {
        return res
          .status(400)
          .send(
            "Invoice cannot be created because the order number already exists."
          );
      }

      const newInvoiceOrQuote = new InvoiceOrQuote({
        type,
        orderNumber,
        note,
        dateOrdered,
        dateDue,
        orderTotal,
        shippingMethod,
        paymentMethod,
        billingFirstName,
        billingLastName,
        billingCity,
        billingAddress,
        billingState,
        billingEmailAddress,
        shippingFirstName,
        shippingLastName,      
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPostcode,
        items,
        payments,
        paymentPaid, 
        paymentDue, 
        paymentTerms,
        paymentDates,

      });

      await newInvoiceOrQuote.save();

      res.status(201).json({
        message: "Invoice or quote created successfully",
        uniqueKey: newInvoiceOrQuote.uniqueKey,
        invoiceOrQuote: newInvoiceOrQuote,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while creating the invoice or quote");
    }
  });














// exports.getAllInvoicesQuotes = async (req, res) => {
//   try {
//     // Construct the query object to filter based on request query parameters
//     let query = {};
//     if (req.query.billingFirstName) {
//       query.billingFirstName = {
//         $regex: new RegExp(req.query.billingFirstName, "i"),
//       };
//     }
//     if (req.query.billingLastName) {
//       query.billingLastName = {
//         $regex: new RegExp(req.query.billingLastName, "i"),
//       };
//     }
//     if (req.query.orderNumber) {
//       query.orderNumber = { $regex: new RegExp(req.query.orderNumber, "i") };
//     }
//     if (req.query.dateOrdered) {
//       // Assuming dateOrdered is stored as ISO string in the database
//       query.dateOrdered = { $gte: new Date(req.query.dateOrdered) };
//     }

//     const invoicesQuotes = await InvoiceOrQuote.find(query)
//       .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (newest first)
//       .exec();

//     res.status(200).json({
//       success: true,
//       data: invoicesQuotes,
//     });
//   } catch (error) {
//     console.error("Error fetching invoices and quotes:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };







exports.getAllInvoicesQuotes = async (req, res) => {
  try {
    // Construct the query object to filter based on request query parameters
    let query = {};
    
    // Filtering by billing first name
    if (req.query.billingFirstName) {
      query.billingFirstName = {
        $regex: new RegExp(req.query.billingFirstName, "i"),
      };
    }
    
    // Filtering by billing last name
    if (req.query.billingLastName) {
      query.billingLastName = {
        $regex: new RegExp(req.query.billingLastName, "i"),
      };
    }
    
    // Filtering by order number
    if (req.query.orderNumber) {
      query.orderNumber = { $regex: new RegExp(req.query.orderNumber, "i") };
    }
    
    // Filtering by date ordered range
    if (req.query.dateOrderedStart && req.query.dateOrderedEnd) {
      query.dateOrdered = {
        $gte: new Date(req.query.dateOrderedStart),
        $lte: new Date(req.query.dateOrderedEnd),
      };
    } else if (req.query.dateOrderedStart) {
      query.dateOrdered = { $gte: new Date(req.query.dateOrderedStart) };
    } else if (req.query.dateOrderedEnd) {
      query.dateOrdered = { $lte: new Date(req.query.dateOrderedEnd) };
    }
    
    // Filtering by date due range
    if (req.query.dateDueStart && req.query.dateDueEnd) {
      query.dateDue = {
        $gte: new Date(req.query.dateDueStart),
        $lte: new Date(req.query.dateDueEnd),
      };
    } else if (req.query.dateDueStart) {
      query.dateDue = { $gte: new Date(req.query.dateDueStart) };
    } else if (req.query.dateDueEnd) {
      query.dateDue = { $lte: new Date(req.query.dateDueEnd) };
    }

    const invoicesQuotes = await InvoiceOrQuote.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (newest first)
      .exec();

    res.status(200).json({
      success: true,
      data: invoicesQuotes,
    });
  } catch (error) {
    console.error("Error fetching invoices and quotes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};




















exports.deleteInvoiceQuote = async (req, res) => {
  const { uniqueKey } = req.body;

  try {
    // Find and delete the invoice or quote by uniqueKey
    const deletedInvoiceQuote = await InvoiceOrQuote.findOneAndDelete({
      uniqueKey,
    });

    if (!deletedInvoiceQuote) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice or quote not found" });
    }

    res.status(200).json({ success: true, data: deletedInvoiceQuote });
  } catch (error) {
    console.error("Error deleting invoice or quote:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.getInvoiceQuoteById = async (req, res) => {
  const { id } = req.params; // id is the uniqueKey in this case

  try {
    const invoiceQuote = await InvoiceOrQuote.findOne({ uniqueKey: id });

    if (!invoiceQuote) {
      return res.status(404).json({ message: "Invoice or Quote not found" });
    }

    res.json(invoiceQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT (update) an invoice or quote by uniqueKey
// exports.updateInvoiceQuote = async (req, res) => {

//   console.log("first function is running")

//   const { id } = req.params; // id is the uniqueKey in this case
//   const updateData = req.body;

//   try {
//     const updatedInvoiceQuote = await InvoiceOrQuote.findOneAndUpdate(
//       { uniqueKey: id },
//       updateData,
//       { new: true } // Return the updated document
//     );

//     if (!updatedInvoiceQuote) {
//       return res.status(404).json({ message: "Invoice or Quote not found" });
//     }

//     res.json(updatedInvoiceQuote);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// update/ edit quote base on id (uniquekey)
exports.updateInvoiceQuote = async (req, res) => {
  console.log("second function is running")
  const {
    type,
    orderNumber,
    note,
    dateOrdered,
    dateDue,
    orderTotal,
    items,
    billingFirstName,
    billingLastName,
    billingCity,
    billingAddress,
    billingState,
    billingEmailAddress,
    shippingFirstName,
    shippingLastName,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPostcode,
    paymentMethod,
    paymentPaid,
    paymentDue,
    payments,
    paymentTerms,
    paymentDates,
  } = req.body;

  try {
    // Validate the request body (you can use a validation library like Joi for better validation)
    if (!type || !["invoice", "quote"].includes(type)) {
      return res
        .status(400)
        .send("Invalid type. Must be 'invoice' or 'quote'.");
    }

    // Find the existing document by uniqueKey (assuming uniqueKey is used as the identifier)
    const existingInvoiceOrQuote = await InvoiceOrQuote.findOne({
      uniqueKey: req.params.id,
    });

    if (!existingInvoiceOrQuote) {
      return res.status(404).send("Invoice or quote not found");
    }

    // Update the fields
    existingInvoiceOrQuote.type = type;
    existingInvoiceOrQuote.orderNumber = orderNumber;
    existingInvoiceOrQuote.note = note;
    existingInvoiceOrQuote.dateOrdered = dateOrdered;
    existingInvoiceOrQuote.dateDue = dateDue;
    existingInvoiceOrQuote.orderTotal = orderTotal;
    existingInvoiceOrQuote.billingFirstName = billingFirstName;
    existingInvoiceOrQuote.billingLastName = billingLastName;
    existingInvoiceOrQuote.billingCity = billingCity;
    existingInvoiceOrQuote.billingAddress = billingAddress;
    existingInvoiceOrQuote.billingState = billingState;
    existingInvoiceOrQuote.billingEmailAddress = billingEmailAddress;
    existingInvoiceOrQuote.shippingAddress = shippingAddress;
    existingInvoiceOrQuote.shippingFirstName = shippingFirstName;
    existingInvoiceOrQuote.shippingLastName = shippingLastName;
    existingInvoiceOrQuote.shippingCity = shippingCity;
    existingInvoiceOrQuote.shippingState = shippingState;
    existingInvoiceOrQuote.shippingPostcode = shippingPostcode;
    existingInvoiceOrQuote.paymentMethod = paymentMethod;
    existingInvoiceOrQuote.paymentPaid = paymentPaid;
    existingInvoiceOrQuote.paymentDates = paymentDates;
    existingInvoiceOrQuote.paymentDue = paymentDue;
    existingInvoiceOrQuote.paymentTerms = paymentTerms;
    payments.payments = payments;

    existingInvoiceOrQuote.items = items; // Update items array
    existingInvoiceOrQuote.payments = payments; // Update items array

    // Save the updated document
    await existingInvoiceOrQuote.save();

    // Send a success response with the updated document
    res.status(200).json({
      message: "Invoice or quote updated successfully",
      invoiceOrQuote: existingInvoiceOrQuote,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while updating the invoice or quote");
  }
};

// Controller for getting uploaded invoices by unique keys
exports.getInvoicesByUniqueKeys = async (req, res) => {
  try {
    const { uniqueKeys } = req.body;

    if (!uniqueKeys || !Array.isArray(uniqueKeys)) {
      return res
        .status(400)
        .send("Invalid request. 'uniqueKeys' must be an array.");
    }

    const invoices = await InvoiceOrQuote.find({
      uniqueKey: { $in: uniqueKeys },
    });

    if (!invoices || invoices.length === 0) {
      return res
        .status(404)
        .send("No invoices found for the provided unique keys.");
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    res.status(500).send("An error occurred while retrieving the invoices");
  }
};

// Controller for deleting multiple invoices by unique keys
exports.deleteMultipleInvoices = async (req, res) => {
  try {
    const { uniqueKeys } = req.body;

    if (!uniqueKeys || !Array.isArray(uniqueKeys)) {
      return res
        .status(400)
        .send("Invalid request. 'uniqueKeys' must be an array.");
    }

    const result = await InvoiceOrQuote.deleteMany({
      uniqueKey: { $in: uniqueKeys },
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send("No invoices found for the provided unique keys.");
    }

    res
      .status(200)
      .send(`Deleted ${result.deletedCount} invoices successfully`);
  } catch (error) {
    console.error("Error deleting invoices:", error);
    res.status(500).send("An error occurred while deleting the invoices");
  }
};

exports.getByUniqueKeys = async (req, res) => {
  try {
    const { uniqueKeys } = req.body;
    // Convert uniqueKeys array elements to Numbers
    const ids = uniqueKeys.map(Number);
    const invoices = await InvoiceOrQuote.find({ uniqueKey: { $in: ids } });
    res.json(invoices);
  } catch (error) {
    console.error("Error Getting by Unique keys:", error);
    res.status(500).send("Server error");
  }
};






exports.updatePayments = async (req, res) => {
  const { orderNumber, payments } = req.body;

  try {
    // Find the invoice or quote by orderNumber and update its payments
    const updatedInvoiceOrQuote = await InvoiceOrQuote.findOneAndUpdate(
      { orderNumber },
      { $push: { payments: { $each: payments } } },
      { new: true }
    );

    if (!updatedInvoiceOrQuote) {
      // Order number not found
      return res.status(404).json({ message: `Order Number ${orderNumber} not found` });
    }

    // Successful update
    res.status(200).json(updatedInvoiceOrQuote);
  } catch (error) {
    // Server error
    console.error('Error updating payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to delete payments
exports.deletePayments = async (req, res) => {
  const { orderNumber } = req.body;

  try {
    const updatedInvoiceOrQuote = await InvoiceOrQuote.findOneAndUpdate(
      { orderNumber },
      { $set: { payments: [] } }, 
      { new: true }
    );

    if (!updatedInvoiceOrQuote) {
      return res.status(404).json({ message: `Order Number ${orderNumber} not found` });
    }

    res.status(200).json(updatedInvoiceOrQuote);
  } catch (error) {
    console.error('Error deleting payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


