import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import FlightDetailView from '../views/FlightDetailView.vue'
import AboutView from '../views/AboutView.vue'
import FlightsView from "../views/FlightsView.vue";
import AuthSection from "../AuthSection.vue";
import {useUserStore} from "../stores/UserStore";
import ReservationsView from "../views/ReservationsView.vue";
import NewFlightView from "../views/NewFlightView.vue";
import StatusView from "../views/StatusView.vue";
import NewNotificationView from "../views/NewNotificationView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthSection,
      beforeEnter: checkAuthentication,
      children:[
        {
          path: '/flights',
          name: 'flights',
          component: FlightsView
        },
        {
          path: '/flights/:id',
          name: 'flightDetail',
          component: FlightDetailView
        },
        {
          path: '/reservations',
          name: 'reservations',
          component: ReservationsView
        },
        {
          path: '/flight/create',
          name: 'createFlight',
          component: NewFlightView
        },
        {
          path: '/notification/create',
          name: 'createNotification',
          component: NewNotificationView
        },
        {
          path: '/:id/status',
          name: 'flightStatus',
          component: StatusView
        },
      ]
    }
  ]
})

function checkAuthentication(to, from, next) {
  const store = useUserStore();
  if (store.isAuthenticated) {
    next();
  } else {
    store.setLoginMessage("Please, log in to access the private section of the web.")
    store.setAfterLoginRoute(to)
    next({name: 'login'})
  }
}

export default router
