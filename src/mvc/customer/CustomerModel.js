const { connection } = require("../../../config/connection");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

const defaultValues = 0;
const activeValues = 1;

const customerModel = {
  searchByNameOrPhone: async (searchtext) => {
    try {
      const searchTextWithWildcards = `%${searchtext}%`;
      const query = `
        SELECT * 
        FROM customer
        WHERE (customer.customer_phone LIKE ? OR customer.customer_name LIKE ?) AND customer.is_delete = ?`;

      const results = await queryAsync(query, [searchTextWithWildcards, searchTextWithWildcards, defaultValues]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getCustomerById_async: async (customer_id) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE customer_id = ? AND is_delete = ?",
        [customer_id, defaultValues]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const results = await queryAsync("SELECT * FROM customer WHERE is_delete = 0 ");
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomersWithPagination: async (offset, itemsPerPage) => {
    try {
      const query = `
        SELECT * FROM customer
        WHERE is_delete = ?
        LIMIT ? OFFSET ?
      `;

      const results = await queryAsync(query, [defaultValues, itemsPerPage, offset]);

      // To get the total count of items, execute a separate query
      const countResults = await queryAsync("SELECT COUNT(*) as total FROM customer WHERE is_delete = ?", [defaultValues]);

      const totalItems = countResults[0].total;
      return { results, totalItems };
    } catch (error) {
      throw error;
    }
  },

  getCustomerById: async (customer_id) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE customer_id = ? AND is_delete = ?",
        [customer_id, defaultValues]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomersByDate: async (date) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE is_delete = ? AND DATE(trndate) = ?",
        [defaultValues, date]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },
 
  getAllCustomersByMonth: async (month) => {
    try {
        const results = await queryAsync(
            "SELECT * FROM customer WHERE is_delete = ? AND DATE_FORMAT(trndate, '%Y-%m') = ?",
            [defaultValues, month]
        );
        return results;
    } catch (error) {
        throw error;
    }
},

  getAllCustomersByYear: async (year) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE is_delete = ? AND YEAR(trndate) = ?",
        [defaultValues, year]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomersByRangeofDays: async (fromDate, toDate) => {
    try {
        const results = await queryAsync(
            "SELECT * FROM customer WHERE is_delete = 0 AND DATE(trndate) BETWEEN ? AND ?",
            [fromDate, toDate]
        );
        return results;
    } catch (error) {
        throw error;
    }
},


  getAllCustomersWithPagination: async (offset, itemsPerPage) => {
    try {
      const query = `
        SELECT * FROM customer
        WHERE is_delete = ?
        LIMIT ? OFFSET ?
      `;

      const results = await queryAsync(query, [defaultValues, itemsPerPage, offset]);

      // To get the total count of items, execute a separate query
      const countResults = await queryAsync("SELECT COUNT(*) as total FROM customer WHERE is_delete = ?", [defaultValues]);

      const totalItems = countResults[0].total;
      return { results, totalItems };
    } catch (error) {
      throw error;
    }
  },

  getCustomerByphone: async (customer_phone) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE customer_phone = ? AND is_delete = ?",
        [customer_phone, defaultValues]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getCustomerByemail: async (customer_email) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM customer WHERE customer_email = ? AND is_delete = ?",
        [customer_email, defaultValues]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  addCustomer: async (customer) => {
    try {
      const { customer_name, customer_phone, customer_email } = customer;
      const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");

      const sanitizedcustomer_email = customer_email || '';

      const query =
        "INSERT INTO customer (customer_name, customer_phone, customer_email, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        customer_name,
        customer_phone,
        sanitizedcustomer_email,
        trndate,
        activeValues,
        defaultValues,
      ];

      const results = await queryAsync(query, values);
      const customer_id = results.insertId;
      return customer_id;
    } catch (error) {
      throw error;
    }
  },

  updateCustomer: async (customer, customer_id) => {
    try {
      const { customer_name, customer_phone, customer_email, status } = customer;
      const query =
        "UPDATE customer SET customer_name = ?, customer_phone = ?, customer_email = ?, status = ? WHERE customer_id = ?";
      const values = [
        customer_name,
        customer_phone,
        customer_email,
        status,
        customer_id,
      ];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = customerModel;
