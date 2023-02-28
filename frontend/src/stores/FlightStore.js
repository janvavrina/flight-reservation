import {defineStore} from 'pinia';
import axios from "axios";
import config from "../config";

export const useFlightStore = defineStore('flight', {
    state: () => ({
        flights: [],
        flight: null,
        error: null,
        success: null,
        isLoading: true,
    }),
    getters: {
        getById: state => flights_id => state.flights.find(a => a.flights_id === flights_id),
    },
    actions: {
        async loadAllFlights() {
            try {
                const response = await axios.get(config.backendUrl + '/flights')
                this.flights = response.data;
                this.error = null;
            } catch {
                this.error = 'Cannot download flights.';
            }
        },
        async loadFlightById(id) {
            try {
                const response = await axios.get(config.backendUrl + '/flights/' + id);
                this.flight = response.data;
                this.error = null;
            } catch (e) {
                this.error = "Couldn't load flight";
            }
        },
        async addPerson(id) {
            try {
                const response = await axios.get(config.backendUrl + '/flights/' + id);
                this.flight = response.data;
                this.error = null;
            } catch {
                this.error = 'Cannot update flights.';
            }
        },
        async create(flight) {
            try {
                const response = await axios.post(config.backendUrl + '/flights/', flight);
                this.error = null;
                this.success = 'Successfully created a flight!';
            } catch (e) {
                this.error = 'Cannot create a flight!';
            }
        },
        clearError() {
            this.error = null;
        },
        addOrUpdateInFlightStore(id, flight) {
            const index = this.flights.findIndex(a => a.id === id);
            console.log(index)
            if (index !== -1) {
                this.flights[index] = flight;
            } else {
                this.flights.push(flight);
            }
        },
    }
})