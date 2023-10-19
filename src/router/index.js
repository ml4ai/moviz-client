import Vue from 'vue';
import Router from 'vue-router';
import App from '@/App';
// import Moviz from '@/components/Moviz';

Vue.use(Router);

export default new Router({
  routes: [
    {
      // path: '/',
      // name: 'Moviz',
      // component: Moviz,
      path: '/',
      name: 'Moviz',
      component: App,
    },
  ],
  mode: 'hash',
});
