const { connection } = require("../../../config/connection");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

const UserRoleModel = {
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

  getAllUserRoles: async () => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole WHERE is_delete = 0 AND userroleid != 1"
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllUserRole: async () => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole WHERE is_delete = 0"
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getAllAvailableUserRoles: async () => {
    try {
      const query = `
        SELECT DISTINCT userrole.userroleid, userrole.role, assign_permission.*  
        FROM userrole
        JOIN assign_permission ON userrole.userroleid = assign_permission.userroleid
        WHERE userrole.is_delete = 0
      `;

      const results = await queryAsync(query);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserPermission: async (userRoleId, userid) => {
    try {
      const query =
        "SELECT * FROM assign_permission WHERE userroleid = ? AND is_delete = 0 AND status = 1";
      const values = [userRoleId, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserPermission_async: async (userRoleId, userid) => {
    try {
      const query =
        "SELECT * FROM assign_permission WHERE userroleid = ? AND is_delete = 0";
      const values = [userRoleId, userid];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userid) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM user WHERE userid = ? AND is_delete = 0",
        [userid]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  getUserByname: async (role) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole WHERE role = ? AND is_delete = 0",
        [role]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  addUserRole: async (userRole) => {
    try {
      const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const defaultValues = 0;
      const activeValues = 1;

      const query =
        "INSERT INTO userrole (role, trndate, status, is_delete) VALUES (?, ?, ?, ?)";
      const values = [
        userRole.role,
        trndate,
        activeValues,
        defaultValues,
      ];

      const results = await queryAsync(query, values);
      const userRoleId = results.insertId;

      return userRoleId;
    } catch (error) {
      throw error;
    }
  },

  updateUserRole: async (userRole, userRoleId) => {
    try {
      const { role, status } = userRole;
      const query =
        "UPDATE userrole SET role = ?, status = ? WHERE userroleid = ?";
      const values = [role, status, userRoleId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  updateUserRoleStatus: async (userRoleId, status) => {
    try {
      const query = "UPDATE userrole SET status = ? WHERE userroleid = ?";
      const values = [status, userRoleId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteUserRole: async (userRoleId, value) => {
    try {
      const query = "UPDATE userrole SET is_delete = ? WHERE userroleid = ?";
      const values = [value, userRoleId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  deleteRoles: async (userRoleIds) => {
    try {
      if (!Array.isArray(userRoleIds)) {
        userRoleIds = [userRoleIds]; // Convert to array if it's a single user ID
      }

      let successCount = 0;
      let failCount = 0;

      for (const userRoleId of userRoleIds) {
        const results = await UserRoleModel.getUserRoleById(userRoleId);

        if (results.length === 0) {
          failCount++;
        } else {
          const deleteResult = await UserRoleModel.deleteUserRole(userRoleId, 1);

          if (deleteResult.affectedRows > 0) {
            successCount++;
          } else {
            failCount++;
          }
        }
      }

      const totalCount = userRoleIds.length;
      return { totalCount, successCount, failCount };
    } catch (error) {
      throw error;
    }
  },

  permanentDeleteUserRole: async (userRoleId) => {
    try {
      const query = "DELETE FROM userrole WHERE userroleid = ?";
      const values = [userRoleId];

      const results = await queryAsync(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  userRoleById: async (userRoleId) => {
    try {
      const results = await queryAsync(
        "SELECT * FROM userrole WHERE userroleid = ?",
        [userRoleId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserRoleModel;
