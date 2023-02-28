<template>
  <v-main>
    <p class="text-h1">Flights</p>

    <v-spacer/>
      <v-row>
          <v-col>Company</v-col>
          <v-col>Departure</v-col>
          <v-col>Destination</v-col>
          <v-col>Date</v-col>
          <v-col>Capacity</v-col>
          <v-col>Booking</v-col>
          <v-col v-if="userStore.user.role==='sekretarka' || userStore.user.role==='technik'">Status</v-col>
      </v-row>
      <v-divider class="ma-5"/>
      <v-row v-for="f in flightStore.flights">
          <v-col>{{ f.flights_company }}</v-col>
          <v-col>{{ f.flights_departure }}</v-col>
          <v-col>{{ f.flights_destination }}</v-col>
          <v-col>{{ f.flights_date }}</v-col>
          <v-col>{{ f.flights_occupied }}/{{ f.flights_capacity }}</v-col>
          <v-col><v-btn :to="{name:'flightDetail', params:{id: f.flights_id}}">Book me</v-btn></v-col>
          <v-col v-if="userStore.user.role==='sekretarka' || userStore.user.role==='technik'"> <v-btn :to="{name:'flightStatus', params:{id: f.flights_id}}">Status</v-btn> </v-col>
      </v-row>
  </v-main>
</template>

<script>
import {useFlightStore} from "../stores/FlightStore";
import {mapStores} from "pinia/dist/pinia";
import Error from "../components/Error.vue";
import {useUserStore} from "../stores/UserStore";
export default {
  name: 'Flights',
  components: {Error},
  data() {
    return {
      filterCategory: 'Not selected',
      filterTaken: false,
    }
  },
  created() {
    this.flightStore.loadAllFlights()
  },
  methods:{

  },
  computed: {
    ...mapStores(useFlightStore,useUserStore),
  },
}
</script>
