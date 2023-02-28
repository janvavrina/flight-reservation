import {defineStore} from 'pinia';
import axios from "axios";
import config from "../config";

export const useFlightStatusStore = defineStore('flightStatus', {
    state: () => ({
        statuses: [],
        error: null,
        success: null,
    }),
    actions: {
        async loadFlightStatusByFlightId(flightId) {
            try {
                const response = await axios.get(config.backendUrl + `/flights/${flightId}/status`);
                this.statuses = response.data;
                this.error = null;
            } catch (e) {
                this.error = "Couldn't load flight status";
            }
        },
        async create(id,status) {
            try {
                const response = await axios.post(config.backendUrl + `/flights/${id}/status`,status);
                this.addOrUpdateInFlightStatusStore(id, response.data);
                this.error = null;
                this.success = "You've made a status for flight.";
            } catch {
                this.error = 'Cannot create a status!';
            }
        },

        clearError() {
            this.error = null;
        },
        clearSuccess() {
            this.success = null;
        },
        addOrUpdateInFlightStatusStore(id, status) {
            const index = this.statuses.findIndex(a => a.id === id);
            console.log(index)
            if (index !== -1) {
                this.statuses[index] = status;
            } else {
                this.statuses.push(status);
            }
        },
    }
})