import { createRouter, createWebHashHistory } from 'vue-router'
import { useStore } from '../store'
import Home from '../pages/Home.vue'
import LogIn from '../pages/LogIn.vue'
import SignUp from '../pages/SignUp.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: async () => {
      const store = useStore()
      await store.getUser()
    },
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
    beforeEnter: (to, from, next) => {
      const store = useStore()
      if (store.currentUser) next({ name: 'Home' })
      else next()
    },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    beforeEnter: (to, from, next) => {
      const store = useStore()
      if (store.currentUser) next({ name: 'Home' })
      else next()
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      const store = useStore()
      if (store.currentUser) next()
      else next({ name: 'Home' })
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
