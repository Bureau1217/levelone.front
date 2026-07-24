import {createStore, Store} from 'vuex'
import {InjectionKey} from "vue"
import {IValidateData} from "@/components/FormLockedPage.vue"
import {
  apiGet,
  IApiResonse_home,
  IApiResponse_certificationLogin,
  IApiResponse_locked,
  IApiResponse_preorder
} from "@/global/api"
import router from "@/router"

// define your typings for the store state
export interface AppState {
  appUnlocked:       IValidateData | null
  componentUnlocked: IValidateData | null
  homeData:          IApiResonse_home | IApiResponse_locked | null
  menuOpen:          boolean
  certificationLoginData: IApiResponse_certificationLogin | null
  preorderData: IApiResponse_preorder | null
  easyLightBoxImage: string | null
}

export const key: InjectionKey<Store<AppState>> = Symbol()


export const store = createStore<AppState>({
  state: {
    appUnlocked: null,
    componentUnlocked: null,
    homeData: null,
    menuOpen: false,
    certificationLoginData: null,
    preorderData: null,
    easyLightBoxImage: null,
  },
  mutations: {

    changeCertificationConnection (state, data: IValidateData) {
      state.componentUnlocked = data
    },

    async setCertificationLoginData(state){
      state.certificationLoginData = await apiGet('certification login') as IApiResponse_certificationLogin
    },

    async setPreorderData(state){
      state.preorderData = await apiGet('preorder') as IApiResponse_preorder
    },

    async changeAppConnection (state, data: IValidateData) {
      state.appUnlocked = data

      state.homeData = await apiGet('home', {
        id:       state.appUnlocked?.id || '',
        password: state.appUnlocked?.password || '',
      }) as IApiResponse_locked | IApiResonse_home

      if(state.homeData === null ? 'waiting' : 'pageLocked' in state.homeData ? 'lock' : "unlock") await router.push({name: 'Home'})
    },

    toggleMenu(state) {
      state.menuOpen = !state.menuOpen
      state.menuOpen ? document.body.classList.add('menu-open') : document.body.classList.remove('menu-open')
    },

    closeMenu(state) {
      state.menuOpen = false
      document.body.classList.remove('menu-open')
    },

    setImageToEasyLightBoxImage(state, data: string) {
      state.easyLightBoxImage = data
    },

    removeEasyLightBoxImage(state) {
      state.easyLightBoxImage = null
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    appLockStatus(state): 'unlock' | 'lock' | 'waiting' {
      return state.homeData === null ? 'waiting' : 'pageLocked' in state.homeData ? 'lock' : "unlock"
    }
  }
})
