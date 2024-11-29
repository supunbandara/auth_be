const util = require('util');
const { connection } = require('../../../config/connection');
const queryAsync = util.promisify(connection.query).bind(connection);

const PermissionModel = {
  getPermissionById: async (permissionId) => {
    try {
      const results = await queryAsync('SELECT * FROM permission WHERE permissionid = ?', [permissionId]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllPermissions: async () => {
    try {
      const results = await queryAsync('SELECT * FROM permission');
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllPermissionsWithPagination: async (offset, itemsPerPage) => {
    try {
      const query = 'SELECT * FROM permission LIMIT ? OFFSET ?';
      const results = await queryAsync(query, [itemsPerPage, offset]);

      const totalItemsResults = await queryAsync('SELECT COUNT(*) as total FROM permission');
      const totalItems = totalItemsResults[0].total;

      return { results, totalItems };
    } catch (error) {
      throw error;
    }
  },

  getPermissionByCode: async (permissionCode) => {
    try {
      const results = await queryAsync('SELECT * FROM permission WHERE permission_code = ?', [permissionCode]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  addPermission: async (permission) => {
    try {
      const { permission_code, permission_description } = permission;
      const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = 'INSERT INTO permission (permission_code, permission_description, trndate) VALUES (?, ?, ?)';
      const values = [permission_code, permission_description, trndate];

      const results = await queryAsync(query, values);
      const permissionId = results.insertId;

      return permissionId;
    } catch (error) {
      throw error;
    }
  },

  updatePermission: async (permission, permissionId) => {
    try {
      const { permission_code, permission_description } = permission;
      const query = 'UPDATE permission SET permission_code = ?, permission_description = ? WHERE permissionid = ?';
      const values = [permission_code, permission_description, permissionId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deletePermission: async (permissionId) => {
    try {
      const query = 'DELETE FROM permission WHERE permissionid = ?';
      const values = [permissionId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  permissionById: async (permissionId) => {
    try {
      const results = await queryAsync('SELECT * FROM permission WHERE permissionid = ?', [permissionId]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = PermissionModel;
