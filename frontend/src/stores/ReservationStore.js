import {defineStore} from 'pinia';
import axios from "axios";
import config from "../config";

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        reservations: [],
        error: null,
        success: null,
        isLoading: true,
    }),
    getters: {
        //getById: state => flights_id => state.flights.find(a => a.flights_id === flights_id),
    },
    actions: {
        async loadAllReservations(){
            try {
                const response = await axios.get(config.backendUrl + '/reservations')
                this.reservations = response.data;
                this.error = null;
            } catch {
                this.error = 'Cannot download reservations.';
            }
        },
        async create(id){
          try{
              const response = await axios.post(config.backendUrl+'/reservations/' + id);
              this.addOrUpdateInReservationStore(id,response.data);
              this.error=null;
              this.success="You've made a reservation.";
              setTimeout(() => {
                  this.success=null;
              }, "5000")
              return 0;
          } catch(e) {
              if (e.response.status === 409) {
                  this.error = "Conflict! You've already made a reservation to this flight.";
              }
              else if(e.response.status === 413){
                  this.error = "Cannot book, you would exceed flight capacity.";
              }
              else {
                  this.error = 'Cannot book!';
              }

              setTimeout(() => {
                  this.error=null;
              }, "5000")

              return 1;
          }
        },
        async delete(id){
            try{
                await axios.delete(config.backendUrl+'/reservations/'+id);
                const index = this.reservations.findIndex(a => a.id === id);
                this.reservations.splice(index, 1);
                this.error = null;
            }
            catch{
                this.error='Cannot delete reservation!'
            }
        },
        async updateCensus(input){
            try{
                await axios.put(config.backendUrl+'/reservations/update',input);
                this.success="Successfully updated!"
                setTimeout(() => {
                    this.success=null;
                }, "5000")
                this.error=null;
            }
            catch(e) {
                if(e.response.status === 413) this.error="Cannot exceed flight capacity"
                else this.error = 'Cannot log in!';

                setTimeout(() => {
                    this.error=null;
                }, "5000")
            }
        },
        clearError() {
            this.error = null;
        },
        clearSuccess() {
            this.success = null;
        },
        addOrUpdateInReservationStore(id, reservation){
            const index = this.reservations.findIndex(a => a.id === id);
            if(index !== -1){
                this.reservations[index] = reservation;
            }
            else{
                this.reservations.push(reservation);
            }
        },
    },
})