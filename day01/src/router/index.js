import Vue from 'vue'
import Router from 'vue-router'
import login  from '@/view/login/login'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require:false//该路径的访问不需要登录
      }
    }
  ]
})
