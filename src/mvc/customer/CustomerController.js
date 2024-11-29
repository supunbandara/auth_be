const customerModel = require('./CustomerModel');
const { checkEmail, checkPhone } = require('../../assets/checker');
const { sendEmail } = require('../../../config/mail');

const mobileNumberPattern = /^[+0-9]{12}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => mobileNumberPattern.test(mobileNumber);
const validateEmail = (email) => emailPattern.test(email);

const getAllCustomers = async (req, res) => {
  try {
    const results = await customerModel.getAllCustomers();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const sendmail = async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await sendEmail(to, subject, message);

    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Error sending email' });
  }
};

const getAllCustomersWithPagination = async (req, res) => {
  const { page, pageSize } = req.query;

  const pageNumber = parseInt(page, 10);
  const itemsPerPage = parseInt(pageSize, 10);

  if (isNaN(pageNumber) || isNaN(itemsPerPage) || pageNumber < 0 || itemsPerPage <= 0) {
    return res.status(400).send({ error: "Invalid page or pageSize parameter" });
  }

  const offset = pageNumber * itemsPerPage;

  try {
    const { results, totalItems } = await customerModel.getAllCustomersWithPagination(offset, itemsPerPage);
    res.status(200).send({ data: results, totalItems });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const customerSearch = async (req, res) => {
  const { searchtext } = req.params;
  try {
    const results = await customerModel.searchByNameOrPhone(searchtext);
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const getCustomerById = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const results = await customerModel.getCustomerById(customer_id);
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const addCustomer = async (req, res) => {
  const customer = req.body;

  try {
    if (customer.customer_email !== "N/A") {
      const emailResult = await checkEmail(customer.customer_email);
      if (!emailResult) {
        res.status(400).send({ error: 'Invalid email or Email Alredy exists' });
        return;
      }
    }

    const phoneResult = await checkPhone(customer.customer_phone);

    if (!phoneResult) {
      res.status(400).send({ error: 'Invalid mobile number or mobile number Alredy exists' });
      return;
    }
    
    const customer_id = await customerModel.addCustomer(customer);

    if (!customer_id) {
      res.status(500).send({ error: 'Failed to create customer' });
      return;
    }

    const createdCustomer = await customerModel.getCustomerById(customer_id);
    const responseCustomer = {
      message: 'Customer created successfully',
      customer_id: createdCustomer[0].customer_id,
      customer_name: createdCustomer[0].customer_name,
      customer_phone: createdCustomer[0].customer_phone,
      customer_email: createdCustomer[0].customer_email || '', // Set to empty string if null
    };

    res.status(200).send(responseCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};


const updateCustomer = async (req, res) => {
  const { customer_id } = req.params;
  const customer = req.body;

  if (!validateMobileNumber(customer.customer_phone)) {
    res.status(400).send({ error: 'Invalid mobile number' });
    return;
  }

  if (!validateEmail(customer.customer_email)) {
    res.status(400).send({ error: 'Invalid email' });
    return;
  }

  try {
    const existingCustomer = await customerModel.getCustomerById(customer_id);
    if (existingCustomer.length === 0) {
      res.status(404).send({ error: 'Customer not found' });
      return;
    }

    if (customer.customer_email && customer.customer_email !== existingCustomer[0].customer_email) {
      const emailResult = await checkEmail(customer.customer_email);

      if (!emailResult) {
        res.status(400).send({ error: 'email Alredy exists' });
        return;
      }
    }

    if (customer.customer_phone && customer.customer_phone !== existingCustomer[0].customer_phone) {
      const phoneResult = await checkPhone(customer.customer_phone);

      if (!phoneResult) {
        res.status(400).send({ error: 'mobile number Alredy exists' });
        return;
      }
    }

    const updateResults = await customerModel.updateCustomer(customer, customer_id);
    if (updateResults.affectedRows === 0) {
      res.status(404).send({ error: 'customer not found or no changes made' });
      return;
    }

    res.status(200).send({ message: 'customer updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error updating item in the database' });
  }
};

const deleteCustomers = async (req, res) => {
  const { deleteids } = req.body;

  if (!Array.isArray(deleteids) || deleteids.length === 0) {
    res.status(400).send({ error: 'Invalid customer IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const customer_id of deleteids) {
    try {
      const results = await customerModel.getCustomerById(customer_id);
      if (results.length === 0) {
        console.log(`customer with ID ${customer_id} not found`);
        failCount++;
      } else {
        const deleteResult = await customerModel.deleteCustomer(customer_id, 1);
        if (deleteResult.affectedRows === 0) {
          console.log(`Error deleting customer with ID ${customer_id}: ${deleteError}`);
          failCount++;
        } else {
          successCount++;
          console.log(`customer with ID ${customer_id} deleted successfully`);
        }
      }
    } catch (error) {
      console.error(`Error fetching customer with ID ${customer_id}: ${error}`);
      failCount++;
    }

    if (successCount + failCount === deleteids.length) {
      const totalCount = deleteids.length;
      res.status(200).send({
        totalCount,
        successCount,
        failCount,
      });
    }
  }
};

module.exports = {
  addCustomer,
  updateCustomer,
  customerSearch,
  getAllCustomers,
  getAllCustomersWithPagination,
  getCustomerById,
  deleteCustomers,

  sendmail,
};
