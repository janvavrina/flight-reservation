<template>
  <error v-if="flightStore.error" :text="flightStore.error" @hide="flightStore.clearError()"/>
  <error v-if="reservationStore.error" :text="reservationStore.error" @hide="reservationStore.clearError()"/>
  <success v-if="reservationStore.success" :text="reservationStore.success" @hide="reservationStore.clearSuccess()"/>
  <v-main>
    <p v-if="userStore.user.role==='zakaznik'" class="text-h1">Your reservations</p>
    <p v-else-if="userStore.user.role==='sekretarka' || userStore.user.role==='technik'" class="text-h1">All reservations</p>
    <v-divider class="pa-3"/>
    <v-card class="mb-8 text-center marginauto"  v-if="userStore.user.role==='zakaznik'" v-for="r in reservationStore.reservations">
      <v-row class="pa-2">
        <v-col cols="4">{{ r.flights_departure }}&#10145;{{ r.flights_destination }}</v-col>
        <v-col cols="4">{{ r.flights_date }}</v-col>
        <v-col cols="4">

          <v-text-field
              class="ma-2" label="Census" type="number" min="1" :max="r.flights_capacity" :v-model="r.reservations_census"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn :to="{name:'flightStatus', params:{id: r.flights_id}}">Status</v-btn>
          <v-btn @click="updateCensus(r.reservations_id)">Update</v-btn>
          <v-btn @click="deleteReservation(r.reservations_id)">Unbook</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mb-8 text-center marginauto" v-else-if="userStore.user.role==='sekretarka' || userStore.user.role==='technik'" v-for="r in reservationStore.reservations" :key="r.reservations_id">
      <v-row class="pa-2" >
        <v-col cols="2.4">{{ r.users_username }}</v-col>
        <v-divider vertical/>
        <v-col cols="2.4">{{ r.flights_departure }}&#10145;{{ r.flights_destination }}</v-col>
        <v-col cols="2.4">{{ r.flights_date }}</v-col>
        <v-col cols="2.4" class="w-10">
          <v-text-field
              class="ma-2"
              label="Census"
              type="number"
              min="1"
              :max="r.flights_capacity"
              v-model="r.reservations_census"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn :to="{name:'flightStatus', params:{id: r.flights_id}}">Status</v-btn>
          <v-btn @click="updateCensus(r.reservations_id,r.reservations_census)">Update</v-btn>
          <v-btn @click="deleteReservation(r.reservations_id)">Unbook</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else><v-row>Who are you?</v-row></v-card>

  </v-main>
</template>

<script>
import Error from "../components/Error.vue";
import Success from "../components/Success.vue";
import {mapStores} from "pinia";
import {useFlightStore} from "../stores/FlightStore";
import {useUserStore} from "../stores/UserStore";
import {useReservationStore} from "../stores/ReservationStore";

export default {
  name: 'ReservationsView',
  components:{Error,Success},
  data() {
    return {
        census: null,
        removeHeight: '64px'
    }
  },
  created() {
    this.reservationStore.loadAllReservations()
  },
  computed:{
    ...mapStores(useFlightStore),
    ...mapStores(useUserStore),
    ...mapStores(useReservationStore),
  },
  methods:{
    async deleteReservation(reservationId){
      if(this.userStore.isAuthenticated){
        await this.reservationStore.delete(reservationId);
      }
    },
    async updateCensus(reservationId,reservationsCensus){
      if(this.userStore.isAuthenticated){
        var input={
          id: reservationId,
          census: reservationsCensus
        }
        await this.reservationStore.updateCensus(input);
      }
    }
  },
}
</script>

<style scoped>
  .marginauto{
    margin: auto 0;
  }
</style>