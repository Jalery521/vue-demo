import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from '../ajax/Axios'
Vue.prototype.axios = axios
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('../views/common/Common.vue'),
      children: [
        {
          path: 'home',
          component: () => import(/* webpackChunkName: "home" */ '../components/home/Home'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'article/new',
          component: () => import(/* webpackChunkName: "newarticle" */ '../components/article/ArticleNew'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'article/all',
          component: () => import(/* webpackChunkName: "articleall" */ '../components/article/ArticleAll'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'article/category',
          component: () => import(/* webpackChunkName: "articlecategory" */ '../components/article/ArticleCategory'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'comments',
          component: () => import(/* webpackChunkName: "comments" */ '../components/comments/Comments'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'users',
          component: () => import(/* webpackChunkName: "users" */ '../components/users/Users.vue'),
          meta: {
            checkLogin: true,
          },
        },
        {
          path: 'userCenter',
          component: () => import(/* webpackChunkName: "userCenter" */ '../components/userCenter/UserCenter.vue'),
          meta: { checkLogin: true },
        },
        {
          path: 'settings/chart',
          component: () => import(/* webpackChunkName: "settings_chart" */ '../components/settings/Chart.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
    },
  ],
})
export default router
