const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  addPermission,
  updatePermission,
  permanentDeletePermission,
  getAllPermissionsWithPagination,
} = require('../../mvc/permission/PermissionController');
const { authorizeAccessSupoerAdmin, authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessSupoerAdmin, addPermission);
  router.get('/all', authorizeAccessControll, getAllPermissions);
  router.get('/allWithPagination', authorizeAccessControll, getAllPermissionsWithPagination);
  router.get('/:permissionId', authorizeAccessSupoerAdmin, getPermissionById);
  router.put('/update/:permissionId', authorizeAccessSupoerAdmin, updatePermission);
  router.delete('/delete/permanent/:permissionId', authorizeAccessSupoerAdmin, permanentDeletePermission);

  return router;
};
