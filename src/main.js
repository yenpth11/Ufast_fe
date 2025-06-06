/*
 =========================================================
 * Vue Black Dashboard - v1.1.3
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2024 Creative Tim (http://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from "vue-router-prefetch";
import App from "./App";
// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router/index";
import VueAxios from "vue-axios";
import axios from "axios";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { UserGroupIcon } from '@vue-hero-icons/solid';
import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n";
import "./registerServiceWorker";
Vue.use(VueAxios, { $request: axios })
Vue.use(VueSweetalert2);
Vue.use(BlackDashboard);
Vue.use(UserGroupIcon);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
