const { connection } = require("../../../config/connection");
const { promisify } = require("util");
const moment = require("moment-timezone");

const queryAsync = promisify(connection.query).bind(connection);

const NotificationModal = {
  // admin
  updateNotification: async (
    reference,
    description,
    title,
    type,
    impact_id
  ) => {
    const query =
      "INSERT INTO notification (title, description, type, reference_id, impact_id, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, 1, NOW(), 0)";
    const values = [title, description, type, reference, impact_id];

    try {
      const results = await queryAsync(query, values);

      const notificationId = results.insertId;
      return notificationId;
    } catch (error) {
      throw error;
    }
  },

  updateStatus(notification_id, status) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE notification SET status = ? WHERE notification_id = ?";
      const values = [status, notification_id];

      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  updateStatusByReference(reference_id, status) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE notification SET status = ? WHERE reference_id = ?";
      const values = [status, reference_id];

      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  getAllNotifications: async (type) => {
    try {
      if (type == 0) {
        query = "SELECT * FROM notification WHERE status = 1";
        const notifications = await queryAsync(query);
        return notifications;
      } else {
        query = "SELECT * FROM notification WHERE status = 1 AND type = ?";
        const notifications = await queryAsync(query, [type]);
        return notifications;
      }
    } catch (error) {
      throw error;
    }
  },

  getAllNotificationsByReference: async (reference_id, type) => {
    try {
      const query = "SELECT * FROM notification WHERE status = 1 AND reference_id = ? AND type = ?";
      const notifications = await queryAsync(query, [reference_id, type]);
      return notifications;
    } catch (error) {
      console.error(`Error retrieving notifications: ${error}`);
      throw error; // Rethrow the error to indicate failure
    }
  },

  getAllNotificationsByBranch: async (impact_id) => {
    try {
      query = "SELECT * FROM notification WHERE impact_id = ?";
      const notifications = await queryAsync(query, [impact_id]);
      return notifications;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = NotificationModal;
