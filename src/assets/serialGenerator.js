const { connection } = require('../../config/connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);


const generateUniqueSerialNumber = async () => {
  try {
    const lastRepair = await getLastRepair();
    const lastRepairId = lastRepair ? lastRepair.repair_id : 'REP000000000';

    // If it's the first repair, start with 'REP000000001', otherwise increment
    const lastIdNumber = parseInt(lastRepairId.match(/\d+$/)[0], 10) + 1;
    const newRepairId = `REP${String(lastIdNumber).padStart(9, '0')}`;
    return newRepairId;
  } catch (error) {
    throw error;
  }
};

const getLastRepair = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM repair ORDER BY trndate DESC LIMIT 1',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};


const getLastSale = async () => {
  try {
    const results = await queryAsync('SELECT * FROM sales ORDER BY trndate DESC LIMIT 1');
    return results[0];
  } catch (error) {
    throw error;
  }
};

const generateSerialNumberForSales = async () => {
  try {
    const lastSale = await getLastSale();
    const lastSalesId = lastSale ? lastSale.salesid : 'SEL000000000';
    const lastIdNumber = parseInt(lastSalesId.match(/\d+$/)[0], 10) + 1;
    const newSalesId = `SEL${String(lastIdNumber).padStart(9, '0')}`;
    return newSalesId;
  } catch (error) {
    throw error;
  }
};

const generateAccessKeyId = async () => {
  try {
    const lastAccess = await getLastAccess();
    const lastAccessKeyId = lastAccess ? lastAccess.key_id : 'KEY000000000';

    // If it's the first access, start with 'KEY000000001', otherwise increment
    const lastKeyIdNumber = parseInt(lastAccessKeyId.match(/\d+$/)[0], 10) + 1;
    const newAccessKeyId = `KEY${String(lastKeyIdNumber).padStart(9, '0')}`;
    return newAccessKeyId;
  } catch (error) {
    throw error;
  }
};

const getLastAccess = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM access_table ORDER BY trndate DESC LIMIT 1',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

const generateresiptNo = async () => {
  try {
    const lastresipt = await getLastresiptNo();
    const lastresiptNo = lastresipt ? lastresipt.resiptNo : '000000000000';

    // If it's the first access, start with '000000000001', otherwise increment
    const lastresiptNumber = parseInt(lastresiptNo, 10) + 1;
    const newresiptNo = String(lastresiptNumber).padStart(12, '0');
    return newresiptNo;
  } catch (error) {
    throw error;
  }
};

const getLastresiptNo = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM grnpayment ORDER BY trndate DESC LIMIT 1',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};


  module.exports = { generateUniqueSerialNumber, generateSerialNumberForSales, generateAccessKeyId, generateresiptNo};