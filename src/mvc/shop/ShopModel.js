const util = require('util');
const { connection } = require('../../../config/connection');
const queryAsync = util.promisify(connection.query).bind(connection);

const ShopModel = {
  getShopNameandLogo: async () => {
    try {
      const results = await queryAsync('SELECT * FROM shop');
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllShops: async () => {
    try {
      const results = await queryAsync('SELECT * FROM shop');
      return results;
    } catch (error) {
      throw error;
    }
  },

  getShopNameandLogotoReport: async () => {
    try {
      const results = await queryAsync('SELECT * FROM shop');
      return results;
    } catch (error) {
      throw error;
    }
  },

  addShop: async (shop) => {
    try {
      const { shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo } = shop;
      const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const defaultValues = 0;

      const query = 'INSERT INTO shop (shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo];

      const results = await queryAsync(query, values);
      const shopId = results.insertId;
      return shopId;
    } catch (error) {
      throw error;
    }
  },

  updateShop: async (shop) => {
    try {
      const { shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp } = shop;
      const query = 'UPDATE shop SET shopname = ?, shopnphonenumber = ?, address = ?, email = ?, website = ?, facebook = ?, instragram = ?, whatsapp = ?';
      const values = [shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateLogo: async (logo) => {
    try {
      const query = 'UPDATE shop SET logo = ?';
      const values = [logo];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ShopModel;
