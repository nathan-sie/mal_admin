import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'
import nprogress from 'nprogress'

const routes = [
  {
  //路由初始指向
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/login',
    children: [
      // 首页
      {
        path: '/account',
        name: 'account',
        component: () => import('../views/Account.vue'),
        meta: {
          index: '5'
        }
      },
      // 商品分类
      {
        path: '/category',
        name: 'category',
        component: () => import('../views/Category.vue'),
        meta: {
          index: '1'
        }
      },
      // 商品管理 
      {
        path: '/good',
        name: 'good',
        component: () => import('../views/Good.vue'),
        meta: {
          index: '2'
        }
      },
      // 商品采购
      {
        path: '/purchase',
        name: 'purchase',
        component: () => import('../views/Purchase.vue'),
        meta: {
          index: '3'
        }
      },
      // 商品销售
      {
        path: '/sell',
        name: 'sell',
        component: () => import('../views/Sell.vue'),
        meta: {
          index: '4'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// let whiteList = []

// router.beforeEach((to, from, next) => {
//   nprogress.start()
//   if (!localStorage.getItem("token")) {  // 验证有没有token权限
//     next('/login')
//   } else {
//     next('/')
//   }
  
// })

// router.afterEach((to, from) => {
//   nprogress.done()
// })
export default router
