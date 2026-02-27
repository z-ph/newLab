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
 * 子路由元数据配置（包含路径）
 */
interface SubRouteMeta {
  name: string
  title: string
  icon: PrimeIcon
  path: TeacherRoutePath
}

/**
 * 路由元数据配置（为路由补充显示名称和图标）
 */
interface RouteMeta {
  name: string
  title: string
  icon: PrimeIcon
  children?: SubRouteMeta[] // 新增：支持二级菜单
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
  | 'pi pi-folder'
  | 'pi pi-video'
  | string

/**
 * 菜单项类型
 */
export interface MenuItem {
  path: TeacherRoutePath
  name: string
  title: string
  icon: PrimeIcon
  children?: MenuItem[] // 新增：支持二级菜单
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
    children: [
      {
        name: 'course-list',
        title: '课程列表',
        icon: 'pi pi-list',
        path: '/teacher/courses/',
      },
      {
        name: 'course-create',
        title: '创建课程',
        icon: 'pi pi-plus',
        path: '/teacher/courses/create',
      },
    ],
  },
  '/teacher/classes/': {
    name: 'classes',
    title: '班级管理',
    icon: 'pi pi-users',
    children: [
      {
        name: 'class-list',
        title: '班级列表',
        icon: 'pi pi-list',
        path: '/teacher/classes/list',
      },
      {
        name: 'class-create',
        title: '创建班级',
        icon: 'pi pi-plus',
        path: '/teacher/classes/create',
      },
      {
        name: 'class-import',
        title: '批量导入',
        icon: 'pi pi-upload',
        path: '/teacher/classes/import',
      },
      {
        name: 'class-bind',
        title: '绑定实验',
        icon: 'pi pi-link',
        path: '/teacher/classes/bind',
      },
    ],
  },
  '/teacher/experiments/': {
    name: 'experiments',
    title: '实验模版管理',
    icon: 'pi pi-file-edit',
    children: [
      {
        name: 'experiment-list',
        title: '实验列表',
        icon: 'pi pi-list',
        path: '/teacher/experiments/list',
      },
      {
        name: 'experiment-create',
        title: '创建实验',
        icon: 'pi pi-plus',
        path: '/teacher/experiments/create',
      },
    ],
  },
  // '/teacher/class-experiments/': {
  //   name: 'class-experiments',
  //   title: '班级实验管理',
  //   icon: 'pi pi-folder',
  // },
  '/teacher/videos/': {
    name: 'videos',
    title: '视频管理',
    icon: 'pi pi-video',
    children: [
      {
        name: 'video-list',
        title: '视频列表',
        icon: 'pi pi-list',
        path: '/teacher/videos/list',
      },
      {
        name: 'video-upload',
        title: '上传视频',
        icon: 'pi pi-upload',
        path: '/teacher/videos/upload',
      },
    ],
  },
  '/teacher/topics/': {
    name: 'topics',
    title: '题目管理',
    icon: 'pi pi-question-circle',
    children: [
      {
        name: 'topic-list',
        title: '题目列表',
        icon: 'pi pi-list',
        path: '/teacher/topics/list',
      },
      {
        name: 'topic-create',
        title: '创建题目',
        icon: 'pi pi-plus',
        path: '/teacher/topics/create',
      },
    ],
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
    children: meta!.children?.map((child) => ({
      path: child.path as TeacherRoutePath,
      name: child.name,
      title: child.title,
      icon: child.icon,
    })),
  }))
  .sort((a, b) => {
    // 自定义排序
    const order = [
      '/teacher/overview/',
      '/teacher/courses/',
      '/teacher/classes/',
      '/teacher/experiments/',
      '/teacher/class-experiments/',
      '/teacher/videos/',
      '/teacher/topics/',
    ]
    return order.indexOf(a.path) - order.indexOf(b.path)
  })

/**
 * 菜单路由映射类型
 */
export type MenuRouteMap = typeof MENU_ITEMS
