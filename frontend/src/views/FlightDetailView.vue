<template>
  <error v-if="flightStore.error" :text="flightStore.error" @hide="flightStore.clearError()"/>
  <error v-if="reservationStore.error" :text="reservationStore.error" @hide="reservationStore.clearError()"/>
  <success v-if="reservationStore.success" :text="reservationStore.success" @hide="reservationStore.clearSuccess()"/>
  <v-main class="d-flex justify-center ma-2">
    <div v-if="flight">
      <v-card class="pa-3" elevation="5">
        <v-card-header>
          <v-card-header-text><p class="text-h1">Flight from {{ flight.flights_company }}</p></v-card-header-text>
        </v-card-header>
        <v-timeline direction="horizontal" class="pa-6">
          <v-timeline-item class="ma-4">
            {{ flight.flights_departure }}
          </v-timeline-item>

          <v-timeline-item>&#128640;</v-timeline-item>

          <v-timeline-item class="ma-4">
            {{ flight.flights_destination }}
          </v-timeline-item>
        </v-timeline>
        <v-card-content>
          <v-row>
            <v-col>
              <v-card-text class="text-center text-uppercase">Date</v-card-text>
              <v-card-text class="border border-dark">{{ flight.flights_date }}</v-card-text></v-col>
            <v-col>
              <v-card-text class="text-center text-uppercase">Capacity</v-card-text>
              <v-card-text class="border border-dark">{{ flight.flights_occupied }}/{{ flight.flights_capacity }}</v-card-text>
            </v-col>
          </v-row>
        </v-card-content>
        <v-divider/>
        <v-card-actions>
          <v-btn color="primary" :disabled="!isDisabled" :depressed="!isDisabled" @click="addReservation(id) && flight">Book this flight!</v-btn>
          <v-spacer/>
          <v-btn color="red" v-if="!isDisabled" :to="{name:'login'}">You have to login to book.</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-main>
</template>



<script>
  import Error from "../components/Error.vue";
  import {mapStores} from "pinia";
  import {useFlightStore} from "../stores/FlightStore";
  import {useUserStore} from "../stores/UserStore";
  import {useReservationStore} from "../stores/ReservationStore";
  import Success from "../components/Success.vue";

  export default {
    name: 'FlightDetail',
    components:{Error,Success},
    created() {
      this.flightStore.loadFlightById(this.id);
    },
    computed:{
      ...mapStores(useFlightStore),
      ...mapStores(useUserStore),
      ...mapStores(useReservationStore),
      id(){
        return parseInt(this.$route.params.id)
      },
      flight(){
        return this.flightStore.flight
      },
      isDisabled(){
        return this.userStore.isAuthenticated
      }
    },
    methods:{
      async addReservation(flightId){
        if(this.userStore.isAuthenticated){
          const result = await this.reservationStore.create(flightId)
          if(result==0){
            await this.flightStore.addPerson(flightId)
          }
        }
      },
    },
  }
</script>