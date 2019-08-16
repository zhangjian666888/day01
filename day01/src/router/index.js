import Vue from 'vue'
import Router from 'vue-router'
import login  from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import system from '@/view/shouye/system'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import userCrud from '@/view/shouye/user/userCrud'
import menuCrud from '@/view/shouye/menu/menuCrud'
import roleCrud from '@/view/shouye/role/roleCrud'
import updatePassword from '@/view/shouye/user/updatePassword'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/view/shouye/user/updatePassword',
      name: 'updatePassword',
      component: updatePassword,
      meta:{
        require:false//该路径的访问不需要登录
      }
    },
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require:false//该路径的访问不需要登录
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta: {
        require: true//该路径的访问需要登录
      },
      children:[
        {
          path:"/datamain",
          component:datamain,
          children:[//页面主显示区域的页面路由（采用嵌套路由的方式实现）
            {path:'/system',component:system,meta:{require:true}},
            {path:'/datamain/user/userCrud',component:userCrud,meta:{require:true}},
            {path:'/datamain/menu/menuCrud',component:menuCrud,meta:{require:true}},
            {path:'/datamain/role/roleCrud',component:roleCrud,meta:{require:true}},
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }
  ]
})
