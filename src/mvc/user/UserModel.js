const { connection } = require('../../../config/connection');
const bcrypt = require('bcrypt');
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

const {
  generateUniqueSerialNumber,
  generateSerialNumberForSales,
  generateAccessKeyId,
} = require("../../assets/serialGenerator");

const UserModel = {
  getUserByUsernameAndPassword: async (username, password) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE username = ? AND is_delete = 0', [username]);
      
      console.log('results11', results)

      if (results.length === 0) {
        return null; // User with the provided username not found
      }

      const storedPasswordHash = results[0].password;
      const isMatch = await bcrypt.compare(password, storedPasswordHash);

      console.log('isMatch', isMatch)

      if (isMatch) {
        return results; // Passwords match, return the user's data
      } else {
        return null; // Passwords do not match
      }
    } catch (error) {
      throw error;
    }
  },

  saveUserToken: async (userId, token) => {
    try {
      const results = await queryAsync('UPDATE user SET apitoken = ? WHERE userid = ?', [token, userId]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE is_delete = 0 AND username != "admin"');
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllAccessList: async () => {
    try {
      const results = await queryAsync('SELECT * FROM access_table');
      return results;
    } catch (error) {
      throw error;
    }
  },

  updatePasswordByEmail: async (email, newPassword) => {
    try {
      const hash = await bcrypt.hash(newPassword, 10);
      const results = await queryAsync('UPDATE user SET password = ? WHERE email = ?', [hash, email]);
      return results.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  getAllUserWithPagination: async (offset, itemsPerPage) => {
    try {
      const results = await queryAsync(
        'SELECT * FROM user WHERE is_delete = 0 AND username != "admin" AND username != "zfrozen" LIMIT ? OFFSET ?',
        [itemsPerPage, offset]
      );

      const countResults = await queryAsync(
        'SELECT COUNT(*) as total FROM user WHERE is_delete = 0 AND username != "admin" AND username != "zfrozen"'
      );

      const totalItems = countResults[0].total;
      return { results, totalItems };
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userid) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE userid = ? AND is_delete = 0', [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserDetailsBy: async (userid) => {
    try {
      const results = await queryAsync('SELECT *, role FROM user JOIN userrole ON user.userroleid = userrole.userroleid WHERE user.userid = ? AND user.is_delete = 0', [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getallAccess: async () => {
    try {
      const results = await queryAsync('SELECT * FROM access_table');
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE email = ? AND is_delete = 0', [email]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserByPhonenumber: async (phonenumber) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE phonenumber = ? AND is_delete = 0', [phonenumber]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getSupplierByPhonenumber: async (phonenumber) => {
    try {
      const results = await queryAsync('SELECT * FROM supplier WHERE supplier_phone = ? AND is_delete = 0', [phonenumber]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getSupplierByEmail: async (email) => {
    try {
      const results = await queryAsync('SELECT * FROM supplier WHERE supplier_email = ? AND is_delete = 0', [email]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE username = ? AND is_delete = 0', [username]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getMailtemplate: async () => {
    try {
      const results = await queryAsync('SELECT * FROM mail_template');
      return results;
    } catch (error) {
      throw error;
    }
  },

  createAccess: async (userid, password, branchid) => {
    try {
      const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const last_use = new Date().toISOString().slice(0, 19).replace("T", " ");
      const defaultValues = 0;
      const activeValues = 1;

      const hashedPassword = await bcrypt.hash(password, 10);
      const key_id = await generateAccessKeyId();

      const query =
        'INSERT INTO access_table(key_id, userid, password, branchid, status, trndate, last_use, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [
        key_id,
        userid,
        hashedPassword,
        branchid,
        activeValues,
        trndate,
        last_use,
        defaultValues
      ];

      const results = await queryAsync(query, values);
      return key_id;
    } catch (error) {
      console.error('Error creating access:', error);
      throw error;
    }
  },

  addUser: async (user) => {
    try {
      const { fullname, phonenumber, address, email, username, password, userroleid } = user;
      const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const defaultvalues = 0;
      const activevalues = 0;
      const updateEmpty = "";

      const hash = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO user (fullname, phonenumber, address, email, username, password, userroleid, trndate, status, is_delete, profileimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)';
      const values = [fullname, phonenumber, address, email, username, hash, userroleid, trndate, defaultvalues, defaultvalues, updateEmpty];

      const results = await queryAsync(query, values);
      const userId = results.insertId;
      return userId;
    } catch (error) {
      throw error;
    }
  },

  logUserLogin: async (userid, location, loginTime) => {
    try {
      const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const query = 'INSERT INTO user_log (userid, location, login_time, trndate) VALUES (?, ?, ?, ?)';
      const values = [userid, location, loginTime, trndate];

      const results = await queryAsync(query, values);
      const log_id = results.insertId;
      return log_id;
    } catch (error) {
      throw error;
    }
  },

  todayLoggedUsers: async (branchid) => {
    try {
      const query = `
        SELECT 
          user_log.*, 
          user.username AS username
        FROM user_log
        LEFT JOIN user ON user_log.userid = user.userid
        WHERE user_log.branchid = ?
          AND DATE(user_log.trndate) = CURDATE()
        GROUP BY user_log.userid;
      `;
      const results = await queryAsync(query, [branchid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  todayLogginRecodsByuser: async (userid) => {
    try {
      const query = `
        SELECT 
          user_log.*, 
          user.username AS username
        FROM user_log
        LEFT JOIN user ON user_log.userid = user.userid
        WHERE user_log.userid = ? AND DATE(user_log.trndate) = CURDATE()
        ORDER BY user_log.trndate DESC;
      `;
      const results = await queryAsync(query, [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (user, userid) => {
    try {
      const { fullname, phonenumber, address, userroleid, status, branchid } = user;
      const query = 'UPDATE user SET fullname = ?, phonenumber = ?, address = ?, userroleid = ?, status = ?, branchid = ? WHERE userid = ?';
      const values = [fullname, phonenumber, address, userroleid, status, branchid, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  meUpdateUser: async (user, userid) => {
    try {
      const { fullname, phonenumber, address } = user;
      const query = 'UPDATE user SET fullname = ?, phonenumber = ?, address = ? WHERE userid = ?';
      const values = [fullname, phonenumber, address, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateUserProfile: async (userid, profileimage) => {
    try {
      const query = 'UPDATE user SET profileimage = ? WHERE userid = ?';
      const values = [profileimage, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateUserPassword: async (userid, password) => {
    try {
      const hash = await bcrypt.hash(password, 10);
      const query = 'UPDATE user SET password = ? WHERE userid = ?';
      const values = [hash, userid];

      const results = await queryAsync(query, values);
      return results.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  changeEmail: async (userid, newEmail) => {
    try {
      const query = 'UPDATE user SET email = ? WHERE userid = ?';
      const values = [newEmail, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  changeUsername: async (userid, username) => {
    try {
      const query = 'UPDATE user SET username = ? WHERE userid = ?';
      const values = [username, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updatestatus: async (userid, status) => {
    try {
      const query = 'UPDATE user SET status = ? WHERE userid = ?';
      const values = [status, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteuser: async (userid, value) => {
    try {
      const query = 'UPDATE user SET is_delete = ? WHERE userid = ?';
      const values = [value, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteUsers: async (userIds) => {
    try {
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }

      let successCount = 0;
      let failCount = 0;

      for (const userId of userIds) {
        const results = await UserModel.getUserById(userId);

        if (results.length === 0) {
          failCount++;
        } else {
          const deleteResult = await UserModel.deleteuser(userId, 1);

          if (deleteResult) {
            successCount++;
          } else {
            failCount++;
          }
        }
      }

      const totalCount = userIds.length;
      return {
        totalCount,
        successCount,
        failCount,
      };
    } catch (error) {
      throw error;
    }
  },

  perma_deleteuser: async (userid) => {
    try {
      const query = 'DELETE FROM user WHERE userid = ?';
      const values = [userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  userById: async (userid) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE userid = ?', [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  userByEmail: async (email) => {
    try {
      const results = await queryAsync('SELECT * FROM user WHERE email = ?', [email]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAccessByUser: async (userid) => {
    try {
      const results = await queryAsync('SELECT * FROM access_table WHERE userid = ? AND is_delete = 0', [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  removeAccessByUser: async (userid) => {
    try {
      const results = await queryAsync('DELETE FROM access_table WHERE userid = ?', [userid]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAccessByKeyId: async (key_id) => {
    try {
      const results = await queryAsync('SELECT * FROM access_table WHERE key_id = ? AND is_delete = 0', [key_id]);

      if (results.length > 0) {
        const userId = results[0].userid;
        const updateQuery = 'UPDATE access_table SET last_use = NOW() WHERE userid = ?';

        const updateResults = await queryAsync(updateQuery, [userId]);
        return results;
      } else {
        throw new Error('No access record found for the provided key_id');
      }
    } catch (error) {
      throw error;
    }
  },

  getAccessByPassword: async () => {
    try {
      const results = await queryAsync('SELECT * FROM access_table');

      if (results.length > 0) {
        const userId = results[0].userid;
        const updateQuery = 'UPDATE access_table SET last_use = NOW() WHERE userid = ?';

        const updateResults = await queryAsync(updateQuery, [userId]);
        return results;
      } else {
        throw new Error('No access record found');
      }
    } catch (error) {
      throw error;
    }
  },

  updateAccessPasswordByuserid: async (userid, newPassword) => {
    try {
      const hash = await bcrypt.hash(newPassword, 10);
      const query = 'UPDATE access_table SET password = ? WHERE userid = ?';
      const values = [hash, userid];

      const results = await queryAsync(query, values);
      return results.affectedRows;
    } catch (error) {
      throw error;
    }
  },

};

module.exports = UserModel;
