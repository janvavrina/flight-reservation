import {defineStore} from 'pinia'
import axios from "axios";
import config from "../config";
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore('user', {
    state() {
        const oldToken = localStorage.getItem('token');
        if (oldToken) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + oldToken;
        }
        return {
            token: oldToken,
            error: null,
            isLoggingIn: false,
            loginMessage: null,
            afterLoginRoute: null,
            users:[],
            userIds:[],
        }
    },
    getters: {
        isAuthenticated: state => state.token !== null,
        user: state => jwtDecode(state.token),
    },
    actions: {
        async loadAllUsers() {
            try {
                const response = await axios.get(config.backendUrl + '/notifications/users')
                this.users = response.data;
                for(var i=0;i<response.data.length;i++){
                    this.userIds.push(response.data[i].users_id)
                }
                this.error = null;
            } catch {
                this.error = 'Cannot download users.';
            }
        },
        async login(username, password) {
            try {
                this.isLoggingIn = true;

                const data = {username, password};
                const response = await axios.post(
                    config.backendUrl + '/user/login', data);

                this.token = response.data.token;

                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
                localStorage.setItem('token', this.token);
                this.error = null;
                this.loginMessage = null;
                this.isLoggingIn = false;
            } catch(e) {
                if(e.response.status === 404) this.error="Cannot log in, username doesn't exist"
                else this.error = 'Cannot log in!';

                setTimeout(() => {
                    this.error=null;
                }, "5000")
            }
        },
        async register(username, password) {
            try {
                const data = {username, password};
                const response = await axios.post(
                    config.backendUrl + '/user/register', data);
                this.error = null;
            } catch(e) {
                console.log(e)
                if (e.response.status === 409) {
                    this.error = 'Cannot register due to conflict!';
                } else {
                    this.error = 'Cannot register!';
                }
            }
        },
        setAfterLoginRoute(route) {
            this.afterLoginRoute = route;
        },
        setLoginMessage(message) {
            this.loginMessage = message;
        },
        logout() {
            this.token = null;
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        },
        clearError() {
            this.error = null;
        },

    }
})