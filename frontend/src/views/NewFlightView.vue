<template>
  <error v-if="flightStore.error" :text="flightStore.error" @hide="flightStore.clearError()"/>
  <success v-if="flightStore.success" :text="flightStore.success" @hide="flightStore.clearSuccess()"/>
  <v-main>
    <p class="text-h1">Create a new flight</p>
    <v-divider class="mt-3 pa-2"/>
    <v-card>
      <v-card-header>
        <v-card-header-text>Enter information</v-card-header-text>
      </v-card-header>
      <v-form v-model="formValid" lazy-validation ref="form">
        <v-card-subtitle>Company:</v-card-subtitle>
        <v-text-field class="ma-2" label="Company" :rules="inputRules" v-model="newFlight.company"/>
        <v-card-subtitle>Departure:</v-card-subtitle>
        <v-text-field class="ma-2" label="Departure" :rules="inputRules" v-model="newFlight.departure"/>
        <v-card-subtitle>Destination:</v-card-subtitle>
        <v-text-field class="ma-2" label="Destination" :rules="inputRules" v-model="newFlight.destination"/>
        <v-card-subtitle>Date:</v-card-subtitle>
        <v-text-field class="ma-2" label="Date" type="datetime-local" :rules="inputRules" v-model="newFlight.date"
                      clearable/>
        <v-card-subtitle>Capacity:</v-card-subtitle>
        <v-text-field
            class="ma-2" label="Capacity" type="number" min="1" :rules="inputRules" v-model="newFlight.capacity"
        />
        <v-card-actions>
          <v-btn color="primary" type="submit" @click="createFlight(newFlight)">Create</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-main>
</template>

<script>
import Error from "../components/Error.vue";
import {mapStores} from "pinia/dist/pinia";
import {useUserStore} from "../stores/UserStore";
import {useFlightStore} from "../stores/FlightStore";
import Success from "../components/Success.vue";

export default {
  name: "NewFlightView.vue",
  components: {Error, Success},
  data() {
    return {
      formValid: true,
      inputRules: [
        v => !!v || 'Required field',
      ],
      newFlight: {
        company: '',
        departure: '',
        destination: '',
        date: '',
        capacity: ''
      },
    }
  },
  computed: {
    ...mapStores(useUserStore),
    ...mapStores(useFlightStore),
  },
  methods: {
    async createFlight(newFlight) {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      if (this.userStore.isAuthenticated) {
        this.flightStore.create(newFlight);
        this.newFlight.company = ''
        this.newFlight.departure = ''
        this.newFlight.destination = ''
        this.newFlight.date = ''
        this.newFlight.capacity = ''
      }
    },
  }
}
</script>

<style scoped>

</style>