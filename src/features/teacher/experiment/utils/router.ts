/**
 * 实验管理路由跳转工具
 */

import type { Router } from 'vue-router'
import type { ExperimentResponse } from '@/core/api/generated'

/**
 * 跳转到实验编辑页面
 */
export function navigateToExperimentEdit(
  router: Router,
  experiment: ExperimentResponse,
) {
  router.push({
    path: `/teacher/experiments/${experiment.id}/edit`,
    query: {
      tabbarName: experiment.experimentName || '实验编辑',
    },
  })
}

/**
 * 跳转到创建实验页面
 */
export function navigateToExperimentCreate(router: Router) {
  router.push('/teacher/experiments/create')
}
