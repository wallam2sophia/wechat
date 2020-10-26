// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
Vue.config.productionTip = false;
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import './app.css'
import mixins from "./utils/mixins"
Vue.mixin(mixins)
Vue.use(ElementUI);
/* eslint-disable no-new */
const vm = new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
});
