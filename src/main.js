import Vue from 'vue'
import App from './App.vue'
import router from './router'
/*import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()*/
// import store from './store'
import "babel-polyfill"
import Vuex from 'vuex'
Vue.use(Vuex)
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)
// import 'normalize.css/normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/iconfont/iconfont.css'
import iview from 'iview'
Vue.use(iview)
import Loading from './components/loading/loading'
Vue.component('Loading',Loading)
import * as filters from './common/js/filters' // global filters
Vue.config.productionTip = false

import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
import 'vant/lib/vant-css/icon-local.css'
Vue.use(Vant);

import fastClick from 'fastclick'

fastClick.attach(document.body)
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app')
