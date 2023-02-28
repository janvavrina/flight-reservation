import {defineStore} from 'pinia';
import axios from "axios";
import config from "../config";

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        error: null,
        success: null,
        types:['success','info','alert'],
        statuses:['shown','hidden','archived']
    }),
    actions: {
        async create(notification) {
            try {
                const response = await axios.post(config.backendUrl + '/notifications/', notification);
                this.error = null;
                this.success = 'Successfully created a notification!';
            } catch (e) {
                this.error = 'Cannot create a notification!';
            }
        },
        async loadAllNotifications() {
            try {
                const response = await axios.get(config.backendUrl + '/notifications/')
                this.notifications = response.data;
                this.error = null;
            } catch {
                this.error = 'Cannot download notifications.';
            }
        },
        async hideOrArchive(request){
            try{
                await axios.put(config.backendUrl+'/notifications/update',request);
                const index = this.notifications.findIndex(a => a.id === id);
                this.notifications.splice(index, 1);
                this.error = null;
            }
            catch{
                this.error='Cannot update notification!'
            }
        },
        clearError() {
            this.error = null;
        },
        clearSuccess() {
            this.success = null;
        },
        addOrUpdateInNotificationStore(id, status) {
            const index = this.notifications.findIndex(a => a.id === id);
            if (index !== -1) {
                this.notifications[index] = status;
            } else {
                this.notifications.push(status);
            }
        },
    }
})