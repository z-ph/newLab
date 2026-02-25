/**
 * 学生端路由层级配置
 * 用于实现"返回上一级"功能
 */

import type { RouteLocationRaw } from 'vue-router'

/**
 * 路由层级定义
 * key: 当前路由模式
 * value: 父级路由配置
 */
export const STUDENT_ROUTE_HIERARCHY: Record<string, (params: Record<string, string>, query: Record<string, string>) => RouteLocationRaw> = {
  // 实验步骤 → 实验详情
  '/student/experiment-steps/:stepId': (_params, query) => ({
    path: `/student/experiments/${query.experimentId}`,
    query: {
      courseId: query.courseId,
    },
  }),

  // 实验详情 → 课程详情
  '/student/experiments/:experimentId': (_params, query) => ({
    path: `/student/courses/${query.courseId}`,
  }),

  // 课程详情 → 首页
  '/student/courses/:courseId': () => ({
    path: '/student',
  }),

  // 签到记录 → 首页
  '/student/attendance': () => ({
    path: '/student',
  }),

  // 成绩查询 → 首页
  '/student/grades': () => ({
    path: '/student',
  }),

  // 个人中心 → 首页（无需返回按钮）
  '/student/profile': () => ({
    path: '/student',
  }),
}

/**
 * 判断当前路由是否需要显示返回按钮
 */
export const ROUTES_WITHOUT_BACK_BUTTON = [
  '/student',
  '/student/',
  '/student/profile',
]

/**
 * 路由模式匹配
 * 将实际路径与模式进行匹配
 */
function matchRoutePattern(path: string): string | null {
  // 精确匹配
  if (STUDENT_ROUTE_HIERARCHY[path]) {
    return path
  }

  // 动态路由匹配
  for (const pattern of Object.keys(STUDENT_ROUTE_HIERARCHY)) {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')

    if (patternParts.length !== pathParts.length) {
      continue
    }

    let matches = true
    for (let i = 0; i < patternParts.length; i++) {
      // 动态参数（如 :stepId）匹配任意值
      if (patternParts[i]!.startsWith(':')) {
        continue
      }
      if (patternParts[i] !== pathParts[i]) {
        matches = false
        break
      }
    }

    if (matches) {
      return pattern
    }
  }

  return null
}

/**
 * 获取父级路由
 * @param currentPath 当前路径
 * @param params 路由参数
 * @param query 查询参数
 * @returns 父级路由配置，如果没有父级则返回 null
 */
export function getParentRoute(
  currentPath: string,
  params: Record<string, string> = {},
  query: Record<string, string> = {}
): RouteLocationRaw | null {
  const pattern = matchRoutePattern(currentPath)

  if (!pattern) {
    return null
  }

  const getParent = STUDENT_ROUTE_HIERARCHY[pattern]
  if (!getParent) {
    return null
  }

  return getParent(params, query)
}

/**
 * 检查是否需要显示返回按钮
 * @param currentPath 当前路径
 * @returns 是否需要显示返回按钮
 */
export function shouldShowBackButton(currentPath: string): boolean {
  // 精确匹配
  if (ROUTES_WITHOUT_BACK_BUTTON.includes(currentPath)) {
    return false
  }

  // 检查是否有匹配的路由模式
  const pattern = matchRoutePattern(currentPath)
  return pattern !== null
}
