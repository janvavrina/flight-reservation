const {database} = require("../database/database");
class NotificationService{
    async create(noti) {
        const result = await database().run(
            "INSERT INTO notifications (notifications_type,notifications_text,users_id,notifications_status,notifications_datetime) VALUES (?,?,?,?,datetime('now','localtime'))",
            noti.type,noti.text,noti.users_id,noti.status
        );
        return await this.getById(result.lastID);
    }

    async delete(id) {
        const result = await database().run(
            "DELETE FROM notifications WHERE (notifications_id=?)",id
        );
        return await this.getById(result.lastID);
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM notifications WHERE notifications_id = ?",
            id
        );
    }

    async getAllNotifications(){
        return await database().all("SELECT * FROM notifications");
    }

    async getAllUsersNotifications(userId){
        return await database().all("SELECT * FROM notifications WHERE (users_id IS NULL OR users_id=?) AND notifications_status='shown'",userId);
    }

    async hideNotification(notificationId) {
        const result = await database().run(
            "UPDATE notifications SET notifications_status = ? WHERE notifications_id = ?", 'hidden',notificationId
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(notificationId);
        }
    }

    async archiveNotification(notificationId) {
        const result = await database().run(
            "UPDATE notifications SET notifications_status = ? WHERE notifications_id = ?", 'archived',notificationId
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(notificationId);
        }
    }
}
module.exports = new NotificationService;