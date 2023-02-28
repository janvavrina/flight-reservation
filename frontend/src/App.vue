<template>
  <v-app theme="dark">
    <v-app-bar>
      <v-btn tag="li" :to="{name:'home'}">Home</v-btn>
      <v-btn tag="li" :to="{name:'flights'}">Flights</v-btn>
      <v-btn tag="li" :to="{name:'about'}">About Us</v-btn>
      <v-spacer/>

      <v-menu anchor="bottom end" v-model="userMenuShown">
        <template v-slot:activator="{ props }">
          <v-btn
              icon="mdi-account-circle"
              v-bind="props"
          ></v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!userStore.isAuthenticated" :to="{name:'login'}">
            <v-list-item-title>Log in</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userStore.isAuthenticated">
            <v-list-item-title class="pr-1"><i>{{ userStore.user.username }}</i></v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item v-if="userStore.isAuthenticated" :to="{name:'reservations'}">
            <v-list-item-title>
              Reservations
            </v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item v-if="userStore.isAuthenticated && userStore.user.role==='technik'" :to="{name:'createFlight'}">
            <v-list-item-title>
              Create new flight
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userStore.isAuthenticated && (userStore.user.role==='technik' || userStore.user.role==='sekretarka')" :to="{name:'createNotification'}">
            <v-list-item-title>
              Create new notification
            </v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item v-if="userStore.isAuthenticated" @click="logout()">
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <div class="ma-7 text-right">
      <v-btn
          v-if="userStore.isAuthenticated"
          class="mx-2"
          color="primary"
          icon="mdi-bell"
          @click="overlay = !overlay && this.notificationStore.loadAllNotifications()"
      >
      </v-btn>
    </div>
    <v-dialog scrollable v-model="overlay" v-if="userStore.isAuthenticated">
      <v-card>
        <v-card-text class="noscrollbar">
          <p class="text-h2">Notifications</p>
          <v-divider class="pa-3"/>
          <v-row v-for="n in notificationStore.notifications">
            <v-col>
              <v-icon v-if="n.notifications_type==='success'" icon="mdi-check-outline"/>
              <v-icon v-else-if="n.notifications_type==='info'" icon="mdi-information"/>
              <v-icon v-else-if="n.notifications_type==='alert'" icon="mdi-alert"/>
              <v-icon v-else icon="mdi-help"/>
              {{ n.notifications_datetime }}
            </v-col>
            <v-col>
              {{ n.notifications_text }}
            </v-col>
            <v-col v-if="userStore.isAuthenticated && (userStore.user.role==='technik' || userStore.user.role==='sekretarka')">
              {{ n.notifications_status }}
            </v-col>
            <v-divider class="mr-3 ml-3" color="grey" vertical/>
            <v-col>
              <v-btn @click="hideNotification(n.notifications_id)">Hide</v-btn>
              <v-btn disabled>Hide</v-btn>
              <v-btn @click="archiveNotification(n.notifications_id)">Archive</v-btn>
              <v-btn disabled>Archive</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="ma-3 text-center">
        <v-btn
            v-if="userStore.isAuthenticated"
            class="mx-2"
            color="red"
            icon="mdi-close"
            @click="overlay = !overlay"
        >
        </v-btn>
      </div>
    </v-dialog>
  </v-app>
</template>

<script>
import {mapStores} from "pinia/dist/pinia";
import {useUserStore} from "./stores/UserStore";
import {useNotificationStore} from "./stores/NotificationStore";
import Error from "./components/Error.vue";
import Success from "./components/Success.vue";

export default {
  name: "App",
  components: {Error, Success},
  data() {
    return {
      userMenuShown: false,
      overlay: false,
      status: null
    }
  },
  created() {
    if (this.userStore.isAuthenticated) {
      this.notificationStore.loadAllNotifications()
    }
  },
  computed: {
    ...mapStores(useUserStore),
    ...mapStores(useNotificationStore),
  },
  methods: {
    logout() {
      this.userStore.logout();
      this.$router.push({name: 'home'});
    },
    hideNotification(notiId){
      var input={
        id: notiId,
        status: 'hidden'
      }
      this.notificationStore.hideOrArchive(input)
      this.notificationStore.loadAllNotifications()
    },
    archiveNotification(notiId){
      var input={
        id: notiId,
        status: 'archived'
      }
      this.notificationStore.hideOrArchive(input)
      this.notificationStore.loadAllNotifications()
    }
  }
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.noscrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.noscrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>