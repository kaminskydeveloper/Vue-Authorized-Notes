import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import LogIn from './views/LogIn.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

function loggedInRedirectDashboard(to, from, next) {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
}

function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next();
  } else {
    next('/login');
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LogIn,
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: isLoggedIn,
    },
  ],
});
