import { createRouter, createWebHistory } from 'vue-router'
import ChargingStations from '../ChargingStations.vue'
import CreateStation from '../CreateStation.vue'
import SingleStation from '../SingleStation.vue'
import EditStation from '../EditStation.vue'
import OwnerLogin from '../OwnerLogin.vue'
import OwnerSignup from '../OwnerSignup.vue'

const routes = [
  { path: '/', component: ChargingStations },
  { path: '/create', component: CreateStation },
  { path: '/stations/:id', component: SingleStation },
  { path: '/stations/:id/edit', component: EditStation },
  { path: '/login', component: OwnerLogin },
  { path: '/signup', component: OwnerSignup }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router