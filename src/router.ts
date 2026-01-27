import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupRouteGuards } from '@/core/utils/routeGuards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 配置路由守卫
setupRouteGuards(router)

export default router
