const AssignPermissionModel = require('./PermissionGroupModel');

const getAllAssignPermissions = async (_req, res) => {
  try {
    const results = await AssignPermissionModel.getAllAssignPermissions();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const getAllUserRoleAssignPermissions = async (_req, res) => {
  try {
    const results = await AssignPermissionModel.getAllUserRolePermissions();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const getAllUserRoleAssignPermissionsWithPagination = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(itemsPerPage) || pageNumber < 0 || itemsPerPage <= 0) {
      return res.status(400).send({ error: "Invalid page or pageSize parameter" });
    }

    const offset = pageNumber * itemsPerPage;

    const { results, totalItems } = await AssignPermissionModel.getAllUserRoleAssignPermissionsWithPagination(offset, itemsPerPage);
    res.status(200).send({ data: results, totalItems });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const getAssignPermissionById = async (req, res) => {
  try {
    const { assignPermissionId } = req.params;
    const results = await AssignPermissionModel.getAssignPermissionById(assignPermissionId);

    if (results.length === 0) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const updateAssignPermission = async (req, res) => {
  try {
    const { assignPermissionId } = req.params;
    const assignPermission = req.body;

    const existingPermission = await AssignPermissionModel.getAssignPermissionById(assignPermissionId);

    if (!existingPermission[0]) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    if (assignPermission.permission_code && assignPermission.permission_code !== existingPermission[0].permission_code) {
      const results = await AssignPermissionModel.getPermissionByCode(assignPermission.permission_code);

      if (results.length > 0) {
        res.status(409).send({ error: 'This permission name is already exists' });
        return;
      }

      await updateExistingPermission(assignPermission, assignPermissionId);
    } else {
      await updateExistingPermission(assignPermission, assignPermissionId);
    }

    res.status(200).send({ message: 'Permission updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

const updateExistingPermission = async (assignPermission, assignPermissionId) => {
  await AssignPermissionModel.updateAssignPermission(assignPermission, assignPermissionId);
};

const deleteAssignPermission = async (req, res) => {
  try {
    const { assignPermissionId } = req.params;
    const results = await AssignPermissionModel.getAssignPermissionById(assignPermissionId);

    if (results.length === 0) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    await AssignPermissionModel.deleteAssignPermission(assignPermissionId);
    res.status(200).send({ message: 'Assign permission deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error updating deletion in the database' });
  }
};

module.exports = {
  getAllAssignPermissions,
  getAssignPermissionById,
  getAllUserRoleAssignPermissionsWithPagination,
  updateAssignPermission,
  deleteAssignPermission,
  getAllUserRoleAssignPermissions
};
