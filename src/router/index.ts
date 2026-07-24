import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {store} from "@/store"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Log',
    component: () => import('../views/Log.vue'),
  },
  {
    path: '/pre-order',
    name: 'PreOrder',
    component: () => import('../views/PreOrder.vue'),
  },
  {
    path: '/certification',
    name: 'Certification',
    component: () => import('../views/Certification.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      }
    } else {
      return {
        top: 0,
        behavior: "smooth",
      }
    }
  },
})

export default router
