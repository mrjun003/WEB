// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import GlobalTools from './plugins/globalTools'
import routes from './router'
import './assets/styles/font-awesome.min.css'
import 'normalize.css/normalize.css'
import 'default-passive-events'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(VueRouter);
Vue.use(ElementUI);

// Vue.config.productionTip = false


const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.use(GlobalTools, router);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

// new Vue({
//   router,
//   el: '#app',
//   components: { App },
//   template: '<App/>'
// })
