<template>
  <v-main>
    <v-card>
      <v-card-title v-if="flightStore.flight">Flight from {{ flightStore.flight.flights_company }}</v-card-title>
      <v-card-subtitle v-if="flightStore.flight">{{
          flightStore.flight.flights_departure
        }}&#10145;{{ flightStore.flight.flights_destination }}
      </v-card-subtitle>
      <v-card-content>
        <v-row v-if="flightStatusStore.statuses" v-for="s in flightStatusStore.statuses">
          <v-col>{{ s.flights_status_datetime }}</v-col>
          <v-col>{{ s.flights_status_text }}</v-col>
        </v-row>
      </v-card-content>
    </v-card>
    <v-card class="mt-10" v-if="userStore.user.role==='sekretarka' || userStore.user.role==='technik'">
      <v-card-title>Add status</v-card-title>
      <v-card-content class="pb-0">
        <v-form v-model="formValid" lazy-validation ref="form">
          <v-text-field class="pb-0" label="Text" :rules="inputRules" v-model="newStatus.text"/>
        </v-form>
      </v-card-content>
      <v-card-actions>
        <v-btn color="primary" type="submit" @click="createStatus()">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script>
import Error from "../components/Error.vue";
import Success from "../components/Success.vue";
import {mapStores} from "pinia/dist/pinia";
import {useFlightStore} from "../stores/FlightStore";
import {useUserStore} from "../stores/UserStore";
import {useReservationStore} from "../stores/ReservationStore";
import {useFlightStatusStore} from "../stores/FlightStatusStore";

export default {
  name: "StatusView",
  components: {Error, Success},
  data() {
    return {
      formValid: true,
      status_text: null,
      inputRules: [
        v => !!v || 'Required field',
      ],
      newStatus: {
        id: '',
        text: ''
      },
    }
  },
  created() {
    this.flightStore.loadFlightById(this.flightId)
    this.flightStatusStore.loadFlightStatusByFlightId(this.flightId);
  },
  computed: {
    ...mapStores(useFlightStore),
    ...mapStores(useUserStore),
    ...mapStores(useReservationStore),
    ...mapStores(useFlightStatusStore),
    flightId() {
      return parseInt(this.$route.params.id)
    },
  },
  methods: {
    async createStatus() {
      await this.$refs.form.validate();
      if (!this.formValid) return;
      this.newStatus.id = this.flightId

      if (this.userStore.isAuthenticated) {
        this.flightStatusStore.create(this.flightId, this.newStatus);
        this.newStatus.id = ''
        this.newStatus.text = ''
      }
    },
  }
}
</script>

<style scoped>

</style>