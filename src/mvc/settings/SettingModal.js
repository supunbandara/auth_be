const util = require('util');
const { connection } = require('../../../config/connection');
const queryAsync = util.promisify(connection.query).bind(connection);

const SettingModal = {

  getAllSettings: async () => {
    try {
      const results = await queryAsync('SELECT * FROM settings');
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateSettings: async (field, value) => {
    try {
      const query = `UPDATE settings SET ${field} = ?`;
      const values = [value];
  
      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = SettingModal;
