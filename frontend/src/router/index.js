import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import LogIn from '../pages/LogIn.vue'
import SignUp from '../pages/SignUp.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
