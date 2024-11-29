const express = require('express');

const {
    addCustomer,
    getAllCustomers,
    customerSearch,
    getCustomerById,
    getAllCustomersWithPagination,
    updateCustomer,
    deleteCustomers,

    sendmail
    

} = require ('../../mvc/customer/CustomerController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken,addCustomer);
    router.get('/findcustomer/:searchtext', authenticateToken, customerSearch);
    router.get('/all', authenticateToken,getAllCustomers);
    router.get('/allwithPagination', authenticateToken, getAllCustomersWithPagination);
    router.get('/:customer_id', authenticateToken,getCustomerById);
    router.put('/update/:customer_id', authenticateToken,updateCustomer);
    router.put('/delete', authenticateToken,deleteCustomers);

    //test email
    router.post('/sendmail', authenticateToken,sendmail);

  
    return router;
  };