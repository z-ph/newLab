/**
 * 班级管理路由跳转工具
 */

import type { Router } from 'vue-router'
import type { Class } from '@/core/api/generated'

/**
 * 跳转到班级编辑页面
 */
export function navigateToClassEdit(
  router: Router,
  classItem: Class,
) {
  router.push({
    path: `/teacher/classes/${classItem.classCode}/edit`,
    query: {
      tabbarName: classItem.className || '编辑班级',
      ...(classItem.id ? { id: classItem.id.toString() } : {}),
    },
  })
}

/**
 * 跳转到创建班级页面
 */
export function navigateToClassCreate(router: Router) {
  router.push('/teacher/classes/create')
}

/**
 * 跳转到导入班级页面
 */
export function navigateToClassImport(router: Router) {
  router.push('/teacher/classes/import')
}

/**
 * 跳转到绑定实验页面
 */
export function navigateToClassBind(router: Router) {
  router.push('/teacher/classes/bind')
}
