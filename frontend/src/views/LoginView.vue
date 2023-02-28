<template>
  <error v-if="userStore.error" :text="userStore.error" @hide="userStore.clearError"/>
  <v-alert v-if="userStore.loginMessage" :text="userStore.loginMessage"/>
  <p class="text-h1 d-flex flex-row align-center">
    <v-icon icon="mdi-account-check"/>
    Login
  </p>
  <v-divider class="pa-3"/>
  <v-card class="mb-2 w-50">
    <v-card-title>Don't have an account?</v-card-title>
    <v-card-actions>
      <v-spacer/>
      <v-btn :to="{name:'register'}">You can register here</v-btn>
    </v-card-actions>
  </v-card>
  <v-card>
    <v-card-title>Enter your credentials</v-card-title>
    <v-form v-model="formValid" lazy-validation ref="form">
      <v-card-subtitle>Username:</v-card-subtitle>
      <v-text-field class="ma-5" label="Username" :rules="inputRules" v-model="username"/>
      <v-spacer/>
      <v-card-subtitle>Password:</v-card-subtitle>
      <v-text-field class="ma-5" label="Password" type="password" :rules="inputRules" v-model="password"/>
      <v-card-actions>
        <v-btn color="primary" type="submit" @click="login()">Log me in</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>

</template>

<script>
import {useUserStore} from "../stores/UserStore";
import {mapStores} from "pinia";
import Error from "../components/Error.vue";

export default {
  name: 'Login',
  components: {Error},
  data() {
    return {
      formValid: true,
      inputRules: [
        v => !!v || 'Required field',
      ],
      username: '',
      password: '',
    }
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    async login() {
        await this.$refs.form.validate();
        if(!this.formValid) return;

        await this.userStore.login(this.username,this.password);

        if (!this.userStore.error) {
          this.$router.push(this.userStore.afterLoginRoute ?? {name: 'flights'});
        }
        this.userStore.setAfterLoginRoute(null);
      }
    },
  }
</script>