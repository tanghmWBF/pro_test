import Vue from 'vue'
import VueRouter from 'vue-router'
// 请求路由
import HTTP from './http'

Vue.use(VueRouter)

let routes = []
routes = [...HTTP]
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
  fallback: false,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
