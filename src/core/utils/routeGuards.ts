import type { Router, RouteLocationRaw } from 'vue-router'
import type { RouteNamedMap } from 'vue-router/auto-routes'
import { UserManager } from '@/core/entity/UserManager'
import { TokenManager } from '@/core/entity/TokenManager'

/**
 * 用户角色类型
 */
export type UserRole = 'teacher' | 'student'

/**
 * 从 RouteNamedMap 提取路由路径类型
 */
type RoutePath = keyof RouteNamedMap

/**
 * 角色路由路径类型（基于自动生成的路由）
 */
type TeacherRoute = Extract<RoutePath, `/teacher${string}`>
type StudentRoute = Extract<RoutePath, `/student${string}`>
type PublicRoute = Extract<RoutePath, '/' | '/login'>

/**
 * 角色路径前缀映射
 * 类型基于 RouteNamedMap 约束，确保路径正确性
 */
export const ROLE_PATH_PREFIXES = {
  teacher: '/teacher',
  student: '/student',
} as const satisfies Record<UserRole, string>

/**
 * 角色首页路径映射
 * 类型基于 RouteNamedMap 约束，使用实际存在的路由路径
 */
export const ROLE_HOME_PATHS = {
  teacher: '/teacher/overview' as TeacherRoute,
  student: '/student/overview' as StudentRoute,
} as const satisfies Record<UserRole, RoutePath>

/**
 * 白名单路径（无需登录即可访问）
 * 类型基于 RouteNamedMap 约束
 */
export const PUBLIC_PATHS = [
  '/',
  '/login',
] as const satisfies PublicRoute[]

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
        path: '/login',
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
        path: '/login',
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
