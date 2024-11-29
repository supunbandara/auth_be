const customerModel = require('../mvc/customer/CustomerModel');
const UserModel = require('../mvc/user/UserModel');

const mobileNumberPattern = /^[+0-9]{12}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => mobileNumberPattern.test(mobileNumber);
const validateEmail = (email) => emailPattern.test(email);

const checkEmail = async (email) => {
    if (!validateEmail(email)) {
        return false;
    }

    try {

        const userEmailResults = await UserModel.getUserByEmail(email);
        const customerMailResults = await customerModel.getCustomerByemail(email);
        return !(customerMailResults.length > 0 || userEmailResults.length > 0);

    } catch (error) {
        console.error(error);
        return false;
    }
};

const checkPhone = async (phone) => {
    if (!validateMobileNumber(phone)) {
        return false;
    }

    try {
        const userPhoneResults = await UserModel.getUserByPhonenumber(phone);
        const customerPhoneResults = await customerModel.getCustomerByphone(phone);

        return !(customerPhoneResults.length > 0 || userPhoneResults.length > 0);

    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    checkEmail,
    checkPhone
};
