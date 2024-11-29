const NotificationModal = require("./NotificationModal");
const UserModel = require("../user/UserModel");
const UserroleModel = require("../userrole/UserroleModel");
const NotificationView = require("./NotificationView");

const getAllNotification = async (req, res) => {
    try {
        const { userid } = req.params;
        const { type } = req.query;

        const user = await UserModel.getUserById(userid);

        if (user.length > 0) {
            const notifications = await NotificationModal.getAllNotifications(type);
            const getpermission = await UserroleModel.getUserPermission_async(
                user[0].userroleid,
                userid
            );

            if (getpermission.length > 0) {
                const send_notification = [];
                let count = 0;

                notifications.forEach((values) => {
                    if (values.type == 1 || values.type == 2 || values.type == 3) {
                        if (user[0].branchid == values.impact_id && (getpermission.find((values) => values.permission_code == "notification"))) {
                            send_notification.push(values);
                            count++;
                        }
                    }
                });
                res.status(200).send({ notification: send_notification.length > 0 ? send_notification : [], count: count });
            } else if (user[0].userroleid == 1 || user[0].userroleid == 2) {
                const send_notification = [];
                let count = 0;

                notifications.forEach((values) => {
                    if (values.type == 1 || values.type == 3) {
                        send_notification.push(values);
                        count++;
                    }
                });

                res.status(200).send({ notification: send_notification.length > 0 ? send_notification : [], count: count });
            }
        } else {
            res.status(404).send({ error: "User Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Error fetching data from the database" });
    }
};

const readedNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const update = await NotificationModal.updateStatus(notification_id, 2);
        if (update) {
            res.status(200).send({ message: 'marked as read' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Error fetching data from the database" });
    }
};

module.exports = {
    getAllNotification,
    readedNotification,
};
