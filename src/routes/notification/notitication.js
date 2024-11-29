const express = require('express');
const {
    getAllNotification,
    readedNotification
} = require('../../mvc/notification/NotificationController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  //common access
  router.get('/all/:userid', authenticateToken, getAllNotification);
  router.get('/read/:notification_id', authenticateToken, readedNotification);

  return router;
};
