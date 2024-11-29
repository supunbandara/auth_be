const express = require('express');
const {
  getAllAssignPermissions,
  getAssignPermissionById,
  updateAssignPermission,
  deleteAssignPermission,
  getAllUserRoleAssignPermissionsWithPagination,
  getAllUserRoleAssignPermissions,
} = require('../../mvc/permission_group/PermissionGroupController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessSupoerAdmin, authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.get('/allroles', authorizeAccessSupoerAdmin, getAllUserRoleAssignPermissions);
  router.get('/role/allWithPagination', authorizeAccessControll, getAllUserRoleAssignPermissionsWithPagination);
  router.get('/:assignPermissionId', authorizeAccessSupoerAdmin, getAssignPermissionById);
  router.delete('/delete/:assignPermissionId', authorizeAccessSupoerAdmin, deleteAssignPermission);
  router.put('/update/:assignPermissionId', authorizeAccessSupoerAdmin, updateAssignPermission);


  return router;
};
