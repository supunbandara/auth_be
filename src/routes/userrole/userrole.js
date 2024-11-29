const express = require('express');
const {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  deleteUserRole,
  permanentDeleteUserRole,
  getAllUserRole,
  deleteRoles,
  addPermissiontoUserRole,
  getAllAvailableUserRoles,
  permissionByroleid,
} = require('../../mvc/userrole/UserroleController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessSupoerAdmin } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.get('/permissionByroleid/:userid/:userroleid', authenticateToken, permissionByroleid);

  //super admin only
  router.post('/create', authenticateToken, addUserRole);
  router.put('/addpermissions/:userRoleId', authorizeAccessSupoerAdmin, addPermissiontoUserRole);
  router.get('/all', authenticateToken, getAllUserRoles);
  router.get('/role/all', authenticateToken, getAllUserRole);
  router.get('/availble/all', authenticateToken, getAllAvailableUserRoles);
  router.get('/:userRoleId', authenticateToken, getUserRoleById);
  router.put('/status/:userRoleId', authenticateToken, updateUserRoleStatus);
  router.delete('/delete/:userRoleId', authorizeAccessSupoerAdmin, deleteUserRole);
  router.put('/delete', authorizeAccessSupoerAdmin, deleteRoles);
  router.put('/update/:userRoleId', authenticateToken, updateUserRole);

  return router;
};
