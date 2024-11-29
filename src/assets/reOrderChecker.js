const ItemModel = require('../mvc/item/ItemModel');
const NotificationModal = require('../mvc/notification/NotificationModal');

const reOrderCheck = async (itemid, qty, branchid) => {
    try {
        const singleItem = await ItemModel.getItemById(itemid);

        if (singleItem.length > 0 && qty <= singleItem[0].reorder_level) {
            const Notifications = await NotificationModal.getAllNotificationsByReference(itemid, 3);

            if (Notifications.length == 0) {
                const text = `Item ${singleItem[0].item_name} Re-Order Level Exceeded. Current Stock is ${qty}`;
                const title = 'Re-Order Level Exceeded Alert';
                await NotificationModal.updateNotification(itemid, text, title, 3, branchid);
            }
        }
    } catch (error) {
        console.error(`Error checking re-order level: ${error}`);
        throw error; // Rethrow the error to indicate failure
    }
};

module.exports = {
    reOrderCheck
};
