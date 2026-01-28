/**
 * 路由常量配置
 *
 * 定义角色相关的路由前缀和首页路径
 * 所有路径类型都从 RouteNamedMap 派生，确保类型安全
 */

import type { UserRole, TeacherRoute, StudentRoute, PublicRoute, RoutePath } from '@/core/types/route'

/**
 * 角色路径前缀映射
 * 类型基于 RouteNamedMap 约束，确保路径正确性
 */
export const ROLE_PATH_PREFIXES = {
  teacher: '/teacher',
  student: '/student',
  admin: '/admin'
} as const satisfies Record<UserRole, string>

/**
 * 角色首页路径映射
 * 类型基于 RouteNamedMap 约束，使用实际存在的路由路径
 */
export const ROLE_HOME_PATHS = {
  teacher: '/teacher/overview' as TeacherRoute,
  student: '/student/overview' as StudentRoute,
  admin: '/teacher/overview' as TeacherRoute,
} as const satisfies Record<UserRole, RoutePath>

/**
 * 白名单路径（无需登录即可访问）
 * 类型基于 RouteNamedMap 约束
 */
export const PUBLIC_PATHS = [
  '/',
  '/login',
] as const satisfies PublicRoute[]
