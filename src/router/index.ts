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
    // Défilement animé ("smooth") uniquement pour les ancres dans la MÊME page (ex. cliquer
    // sur "spécifications" depuis Home) : entre deux pages différentes (ex. revenir sur Home
    // depuis Certificats), le scroll doit être instantané. Sinon, la nav (qui se cache/montre
    // selon le scroll) réagit à cette longue animation de défilement automatique et clignote
    // pendant la transition, entre l'ancienne et la nouvelle page.
    const samePage = to.name === from.name

    if (to.hash) {
      return {
        el: to.hash,
        behavior: samePage ? "smooth" : "auto",
        top: to.hash === '#v-home__main' ? +200 : +100,
      }
    } else {
      return {
        top: 0,
        behavior: samePage ? "smooth" : "auto",
      }
    }
  },
})

export default router
