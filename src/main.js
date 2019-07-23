// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
import VueI18n from 'vue-i18n'; Vue.use(VueI18n);

// 引用自定義
import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import timeTampsFilter from './filters/timetamps';

axios.defaults.withCredentials = true;
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

const i18n = new VueI18n({
  locale: 'zhTWValidate'
});
Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    zhTWValidate
  }
});

// 全域啟用元件 
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter)
Vue.filter('timeTamps', timeTampsFilter)

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
  // console.log('to', to, 'from', from, 'next', next);
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    const vm = this;
    axios.post(api).then(response => {
      // console.log(response.data);
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        })
      }
    });
  } else {
    next()
  }

})
