<template>
  <error v-if="notificationStore.error" :text="notificationStore.error" @hide="notificationStore.clearError()"/>
  <success v-if="notificationStore.success" :text="notificationStore.success" @hide="notificationStore.clearSuccess()"/>
  <v-main>
    <p class="text-h1">Create new notification</p>
    <v-divider class="mt-3 pa-2"/>
    <v-card>
      <v-card-header>
        <v-card-header-text>Enter information</v-card-header-text>
      </v-card-header>
      <v-form v-model="formValid" lazy-validation ref="form">
        <v-card-subtitle>User:</v-card-subtitle>
        <v-select  :items="this.userStore.userIds"
                   :item-value="this.userStore.userIds"
                   class="ma-2"
                   v-model="newNotification.users_id"
                    hint="Don't select any if you want to create global notification"/>
        <v-card-subtitle>Type:</v-card-subtitle>
        <v-select class="ma-2" :items="this.notificationStore.types" :rules="inputRules" v-model="newNotification.type"/>
        <v-card-subtitle>Status:</v-card-subtitle>
        <v-select class="ma-2" :items="this.notificationStore.statuses" :rules="inputRules" v-model="newNotification.status"/>
        <v-card-subtitle>Text:</v-card-subtitle>
        <v-text-field class="ma-2" label="Text" :rules="inputRules" v-model="newNotification.text"
                      clearable/>
        <v-card-actions>
          <v-btn color="primary" type="submit" @click="createNotification(newNotification)">Create</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-main>
</template>

<script>
import Error from "../components/Error.vue";
import {mapStores} from "pinia/dist/pinia";
import {useUserStore} from "../stores/UserStore";
import Success from "../components/Success.vue";
import {useNotificationStore} from "../stores/NotificationStore";

export default {
  name: "NewNotificationView.vue",
  components: {Error, Success},
  data() {
    return {
      formValid: true,
      inputRules: [
        v => !!v || 'Required field',
      ],
      newNotification: {
        users_id: null,
        type: null,
        status: null,
        text: ''
      },
    }
  },
  created() {
    if(this.userStore.isAuthenticated) {
      this.userStore.loadAllUsers()
    }
  },
  computed: {
    ...mapStores(useUserStore),
    ...mapStores(useNotificationStore),
  },
  methods: {
    async createNotification(newNotification) {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      if (this.userStore.isAuthenticated) {
        this.notificationStore.create(newNotification);
        this.newNotification.userId = null
        this.newNotification.type = null
        this.newNotification.status = null
        this.newNotification.text = ''
      }
    },
  },
}
</script>

<style scoped>

</style>