import type { Router, RouteLocationRaw } from 'vue-router'
import { UserManager } from '@/core/entity/UserManager'
import { TokenManager } from '@/core/entity/TokenManager'
import type { UserRole, PublicRoute } from '@/core/types/route'
import { ROLE_PATH_PREFIXES, ROLE_HOME_PATHS, PUBLIC_PATHS } from '@/core/constants/route'

/**
 * 检查路径是否为公开路径
 */
function isPublicPath(path: string): path is PublicRoute {
  return PUBLIC_PATHS.some(publicPath => path === publicPath || path.startsWith(publicPath + '/'))
}

/**
 * 根据路径判断应该访问的角色
 */
function getRoleForPath(path: string): UserRole | null {
  if (path.startsWith(ROLE_PATH_PREFIXES.teacher)) {
    return 'teacher'
  }
  if (path.startsWith(ROLE_PATH_PREFIXES.student)) {
    return 'student'
  }
  return null
}

/**
 * 获取用户角色的首页路径
 * 返回类型安全的路由路径（基于 RouteNamedMap）
 */
export function getHomePathForRole(role: UserRole): RouteLocationRaw {
  return ROLE_HOME_PATHS[role]
}

/**
 * 配置路由守卫
 */
export function setupRouteGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const path = to.path

    // 1. 如果是公开路径，直接放行
    if (isPublicPath(path)) {
      next()
      return
    }

    // 2. 检查用户是否已登录
    const hasToken = TokenManager.hasToken()
    const isTokenValid = TokenManager.isValid()

    if (!hasToken || !isTokenValid) {
      // 未登录或 token 已过期，跳转到登录页
      next({
        name: '/login' as PublicRoute,
        query: to.path !== '/login' ? { redirect: to.fullPath } : undefined,
      })
      return
    }

    // 3. 检查路径是否需要特定角色
    const requiredRole = getRoleForPath(path)

    if (!requiredRole) {
      // 路径不需要特定角色，放行
      next()
      return
    }

    // 4. 获取当前用户的角色
    const userRole = UserManager.getRole() as UserRole | undefined

    if (!userRole) {
      // 没有角色信息，跳转到登录页
      next({
        name: '/login' as PublicRoute,
        query: { redirect: to.fullPath },
      })
      return
    }

    // 5. 检查角色是否匹配
    if (userRole !== requiredRole) {
      // 角色不匹配，跳转到用户角色对应的首页
      const homePath = getHomePathForRole(userRole)
      next(homePath)
      return
    }

    // 6. 角色匹配，放行
    next()
  })
}
