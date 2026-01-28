/**
 * 路由类型定义
 *
 * 基于自动生成的 RouteNamedMap 派生路由类型
 * 确保路由路径的类型安全
 */

import type { RouteNamedMap } from 'vue-router/auto-routes'

/**
 * 从 RouteNamedMap 提取路由路径类型
 */
export type RoutePath = keyof RouteNamedMap

/**
 * 用户角色类型
 */
export type UserRole = 'teacher' | 'student'

/**
 * 教师端路由路径类型
 * 从 RouteNamedMap 中提取所有 /teacher 开头的路由
 */
export type TeacherRoute = Extract<RoutePath, `/teacher${string}`>

/**
 * 学生端路由路径类型
 * 从 RouteNamedMap 中提取所有 /student 开头的路由
 */
export type StudentRoute = Extract<RoutePath, `/student${string}`>

/**
 * 公开路由路径类型
 * 从 RouteNamedMap 中提取公开路由（无需认证）
 */
export type PublicRoute = Extract<RoutePath, '/' | '/login'>
