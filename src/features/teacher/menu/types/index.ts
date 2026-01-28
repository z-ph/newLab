/**
 * 教师端菜单配置 - 基于自动生成路由的类型安全系统
 *
 * 核心思想：从自动生成的路由类型派生菜单，避免手动维护
 */

import type { RouteNamedMap } from 'vue-router/auto-routes'

// ============================================================================
// 类型工具：从路由类型派生菜单类型
// ============================================================================

/**
 * 提取所有教师端路由
 */
type TeacherRoutes = {
  [K in keyof RouteNamedMap as K extends `/teacher${string}` ? K : never]: RouteNamedMap[K]
}

/**
 * 路由路径联合类型
 */
type TeacherRoutePath = keyof TeacherRoutes

/**
 * 路由元数据配置（为路由补充显示名称和图标）
 */
interface RouteMeta {
  name: string
  title: string
  icon: PrimeIcon
}

/**
 * PrimeIcons 图标类型
 */
export type PrimeIcon =
  | 'pi pi-home'
  | 'pi pi-users'
  | 'pi pi-book'
  | 'pi pi-list'
  | 'pi pi-pencil'
  | 'pi pi-chart-bar'
  | 'pi pi-calendar'
  | 'pi pi-cog'
  | 'pi pi-bell'
  | string

/**
 * 菜单项类型
 */
export interface MenuItem {
  path: TeacherRoutePath
  name: string
  title: string
  icon: PrimeIcon
}

/**
 * 教师端菜单项类型
 */
export type TeacherMenuItem = MenuItem

// ============================================================================
// 路由元数据配置（唯一的需要手动维护的地方）
// ============================================================================

/**
 * 路由元数据映射
 *
 * 用法：为新页面添加显示名称和图标
 * - key: 路由路径（从 typed-router.d.ts 自动补全）
 * - value: { name, title, icon }
 */
const ROUTE_META: Partial<Record<TeacherRoutePath, RouteMeta>> = {
  '/teacher/overview/': {
    name: 'overview',
    title: '概览',
    icon: 'pi pi-home',
  },
  '/teacher/courses/': {
    name: 'courses',
    title: '课程管理',
    icon: 'pi pi-book',
  },
  '/teacher/classes/': {
    name: 'classes',
    title: '班级管理',
    icon: 'pi pi-users',
  },
  '/teacher/experiments/': {
    name: 'experiments',
    title: '实验管理',
    icon: 'pi pi-file-edit',
  },
}

// ============================================================================
// 从路由派生菜单配置
// ============================================================================

/**
 * 从路由元数据生成菜单配置
 *
 * 原理：
 * 1. 遍历所有教师端路由
 * 2. 从 ROUTE_META 获取元数据
 * 3. 自动生成菜单项
 *
 * 优势：
 * - 新增页面后，只需在 ROUTE_META 添加元数据
 * - 删除页面后，菜单自动移除
 * - 路由路径由类型系统保证正确性
 */
export const MENU_ITEMS: TeacherMenuItem[] = Object.entries(ROUTE_META)
  .filter(([path, meta]) => path.endsWith('/') && meta) // 过滤有效路由
  .map(([path, meta]) => ({
    path: path as TeacherRoutePath,
    name: meta!.name,
    title: meta!.title,
    icon: meta!.icon,
  }))
  .sort((a, b) => {
    // 自定义排序
    const order = [
      '/teacher/overview/',
      '/teacher/courses/',
      '/teacher/classes/',
      '/teacher/experiments/',
    ]
    return order.indexOf(a.path) - order.indexOf(b.path)
  })

/**
 * 菜单路由映射类型
 */
export type MenuRouteMap = typeof MENU_ITEMS
