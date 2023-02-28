<template>
  <p class="text-h1 d-flex flex-row align-center">
    <v-icon icon="mdi-account-plus"/>
     Register
  </p>
  <v-divider class="pa-3"/>
  <error v-if="userStore.error" :text="userStore.error" @hide="userStore.clearError"/>
  <v-card>
    <v-card-title>Enter your credentials</v-card-title>
    <v-card-subtitle>Username: </v-card-subtitle> <v-text-field class="ma-5" label="Username" :rules="inputRules" v-model="username"/>
    <v-spacer/>
    <v-card-subtitle>Password: </v-card-subtitle> <v-text-field class="ma-5" label="Password" :rules="inputRules" type="password" v-model="password"/>
    <v-card-actions>
      <v-btn color="primary" type="submit" @click="register()">Register</v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>
import {useUserStore} from "../stores/UserStore";
import {mapStores} from "pinia";
import Error from "../components/Error.vue";

export default{
  name: 'Register',
  components: {Error},
  data(){
    return{
      inputRules: [
        v => !!v || 'Required field',
      ],
      username:'',
      password:'',
    }
  },
  computed:{
    ...mapStores(useUserStore),
  },
  methods:{
    async register(){
      await this.userStore.register(this.username,this.password);
      if(!this.userStore.error){
        await this.userStore.login(this.username, this.password);
        this.$router.push(this.userStore.afterLoginRoute ?? {name: 'flights'});
      }
      this.userStore.setAfterLoginRoute(null);
    },
  }
}
</script>