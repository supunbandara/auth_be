const UserRoleModel = require("./UserroleModel");
const PermissionGroupModel = require("../permission_group/PermissionGroupModel");
const PermissionGroupView = require("../permission_group/PermissionGroupView");

const getAllUserRoles = async (req, res) => {
  try {
    const results = await UserRoleModel.getAllUserRoles();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getAllUserRole = async (req, res) => {
  try {
    const results = await UserRoleModel.getAllUserRole();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getAllAvailableUserRoles = async (req, res) => {
  try {
    const results = await UserRoleModel.getAllAvailableUserRoles();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const permissionByroleid = async (req, res) => {
  try {
    const { userid, userroleid } = req.params;
    const results = await UserRoleModel.getUserById(userid);

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const userRoleIds = results[0].userroleid;

    if (userRoleIds != userroleid) {
      res.status(404).send({
        error: "UserRole is wrong. This user does not have this role",
      });
      return;
    }

    const permissionResults = await UserRoleModel.getUserPermission(
      userRoleIds,
      userid
    );

    if (permissionResults.length === 0) {
      res.status(404).send({ error: "User permissions not found" });
      return;
    }

    const renderpermissionGroupArray =
      PermissionGroupView.renderpermissionGroup(permissionResults);
    res.status(200).send(renderpermissionGroupArray);
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getUserRoleById = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const results = await UserRoleModel.getUserRoleById(userRoleId);

    if (results.length === 0) {
      res.status(404).send({ error: "UserRole not found" });
      return;
    }

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const addUserRole = async (req, res) => {
  try {
    const { role, permisssionslist } = req.body;
    const userRoleId = await UserRoleModel.addUserRole({ role });

    if (!userRoleId) {
      res.status(404).send({ error: "Failed to create user role" });
      return;
    }

    for (const permission of permisssionslist.values) {
      const assignPermissionId = await PermissionGroupModel.addAssignPermission(
        userRoleId,
        permission
      );

      if (!assignPermissionId) {
        res.status(404).send({ error: "Failed to assign permission" });
        return;
      }
    }

    res.status(200).send({ message: "UserRole created successfully", userRoleId });
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const addPermissiontoUserRole = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const { permisssionslist } = req.body;

    const existingUserrole = await UserRoleModel.getUserRoleById(userRoleId);

    if (!existingUserrole[0]) {
      res.status(404).send({ error: "UserRole not found" });
      return;
    }

    for (const permission of permisssionslist.values) {
      const assignPermissionId = await PermissionGroupModel.addAssignPermission(
        userRoleId,
        permission
      );

      if (!assignPermissionId) {
        res.status(404).send({ error: "Failed to assign permission" });
        return;
      }
    }

    res.status(200).send({ message: "UserRole created successfully", userRoleId });
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const userRole = req.body;
    const existingUserrole = await UserRoleModel.getUserRoleById(userRoleId);

    if (!existingUserrole[0]) {
      res.status(404).send({ error: "UserRole not found" });
      return;
    }

    if (userRole.role && userRole.role !== existingUserrole[0].role) {
      const results = await UserRoleModel.getUserByname(userRole.role);

      if (results.length > 0) {
        res.status(409).send({ error: "this user role is already exists" });
        return;
      }

      await updateExistingUserrole(userRole, userRoleId);
    } else {
      await updateExistingUserrole(userRole, userRoleId);
    }

    res.status(200).send({ message: "user role updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const updateExistingUserrole = async (userRole, userRoleId) => {
  await UserRoleModel.updateUserRole(userRole, userRoleId);
};

const updateUserRoleStatus = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const { status } = req.body;
    const results = await UserRoleModel.getUserRoleById(userRoleId);

    if (results.length === 0) {
      res.status(404).send({ error: "UserRole not found" });
      return;
    }

    await UserRoleModel.updateUserRoleStatus(userRoleId, status);
    res.status(200).send({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const deleteUserRole = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const results = await UserRoleModel.getUserRoleById(userRoleId);

    if (results.length === 0) {
      res.status(404).send({ error: "UserRole not found" });
      return;
    }

    if (userRoleId != 1 || userRoleId != 2) {
      await PermissionGroupModel.deleteAssignPermissionByRoleId(userRoleId);
      await UserRoleModel.deleteUserRole(userRoleId, 1);
      res.status(200).send({ message: "Userrole deleted successfully" });
    } else {
      res.status(404).send({ error: "This User Role cant delete. Please Contact Developer" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error updating deletion in the database" });
  }
};

const deleteRoles = async (req, res) => {
  try {
    const { userRoleIds } = req.body;

    if (!Array.isArray(userRoleIds) || userRoleIds.length === 0) {
      res.status(400).send({ error: "Invalid user role IDs" });
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const userRoleId of userRoleIds) {
      const results = await UserRoleModel.getUserRoleById(userRoleId);

      if (results.length === 0) {
        console.log(`User role with ID ${userRoleId} not found`);
        failCount++;
        continue;
      }

      await UserRoleModel.deleteUserRole(userRoleId, 1);

      successCount++;
      console.log(`User role with ID ${userRoleId} deleted successfully`);
    }

    const totalCount = userRoleIds.length;
    res.status(200).send({
      totalCount,
      successCount,
      failCount,
    });
  } catch (error) {
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const permanentDeleteUserRole = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    await UserRoleModel.permanentDeleteUserRole(userRoleId);
    res.status(200).send({ message: "UserRole permanently deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting user role from the database" });
  }
};

module.exports = {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  getAllUserRole,
  deleteUserRole,
  permanentDeleteUserRole,
  deleteRoles,
  permissionByroleid,
  addPermissiontoUserRole,
  getAllAvailableUserRoles
};
