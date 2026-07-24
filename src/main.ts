import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {key, store} from "@/store"

import "./styles/_main.scss"

router.beforeEach((to, _from, next) => {

  if(store.getters.appLockStatus === 'unlock') {
    next()
  }
  else {
    if(to.name !== 'Log') router.push({name: 'Log'})
    else next()
  }

  store.commit("closeMenu")

})

createApp(App).use(router).use(store, key).mount('#app')

store.commit('setCertificationLoginData')
store.commit('setPreorderData')
store.commit("changeAppConnection")

window.addEventListener("resize", () => {
  store.commit('closeMenu')
})

document.addEventListener('click', e => {

  if(! (e.target instanceof HTMLElement) ) return

  const origin = e.target.closest(`a`)

  if(! origin) return

  if(location.hostname === origin.hostname) return

  e.preventDefault()
  window.open(origin.href,'_blank');
});
