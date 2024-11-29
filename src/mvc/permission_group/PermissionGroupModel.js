const { connection } = require("../../../config/connection");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

const AssignPermissionModel = {
  getAllAssignPermissions: async () => {
    try {
      const results = await queryAsync(
        "SELECT * FROM assign_permission WHERE is_delete = 0"
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllUserRolePermissions: async () => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole JOIN assign_permission ON userrole.userroleid = assign_permission.userroleid JOIN permission ON permission.permission_code = assign_permission.permission_code WHERE assign_permission.is_delete = 0 AND userrole.userroleid != 1 AND userrole.userroleid != 2 "
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllUserRoleAssignPermissionsWithPagination: async (offset, itemsPerPage) => {
    try {
      const query = `
        SELECT * FROM userrole
        JOIN assign_permission ON userrole.userroleid = assign_permission.userroleid
        JOIN permission ON permission.permission_code = assign_permission.permission_code
        WHERE assign_permission.is_delete = 0 AND userrole.userroleid != 1 AND userrole.userroleid != 2
        LIMIT ? OFFSET ?
      `;

      const results = await queryAsync(query, [itemsPerPage, offset]);

      const countResults = await queryAsync(`
        SELECT COUNT(*) as total FROM userrole JOIN assign_permission ON userrole.userroleid = assign_permission.userroleid WHERE assign_permission.is_delete = 0 AND userrole.userroleid != 1 AND userrole.userroleid != 2
      `);

      const totalItems = countResults[0].total;

      return { results, totalItems };
    } catch (error) {
      throw error;
    }
  },

  getAssignPermissionById: async (assignPermissionId) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM assign_permission WHERE assignpermissionid = ? AND is_delete = 0",
        [assignPermissionId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getPermissionByCode: async (permission_code) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM assign_permission WHERE permission_code = ?",
        [permission_code]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserRoleById: async (userRoleId) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole WHERE userroleid = ? AND is_delete = 0",
        [userRoleId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  addAssignPermission: async (userroleid, permission_code) => {
    try {
      const adddate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const defaultValues = 0;
      const activeValues = 1;

      const query =
        "INSERT INTO assign_permission (permission_code, userroleid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?)";
      const values = [permission_code, userroleid, activeValues, adddate, defaultValues];

      const results = await queryAsync(query, values);
      const assignPermissionId = results.insertId;

      return assignPermissionId;
    } catch (error) {
      throw error;
    }
  },

  updateAssignPermission: async (assignPermission, assignPermissionId) => {
    try {
      const { permission_code, status } = assignPermission;

      const query =
        "UPDATE assign_permission SET permission_code = ?, status = ? WHERE assignpermissionid = ?";
      const values = [permission_code, status, assignPermissionId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteAssignPermission: async (assignPermissionId) => {
    try {
      const query = "DELETE FROM assign_permission WHERE assignpermissionid = ?";
      const values = [assignPermissionId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteAssignPermissionByRoleId: async (userroleid) => {
    try {
      const query = "DELETE FROM assign_permission WHERE userroleid = ?";
      const values = [userroleid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  permanentDeleteAssignPermission: async (assignPermissionId) => {
    try {
      const query = "DELETE FROM assign_permission WHERE assignpermissionid = ?";
      const values = [assignPermissionId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AssignPermissionModel;
