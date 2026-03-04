/**
 * 班级实验管理路由跳转工具
 */

import type { Router } from 'vue-router'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'

/**
 * 跳转到班级实验详情页面
 */
export function navigateToClassExperimentDetail(
  router: Router,
  experiment: ClassExperimentDetailResponse,
) {
  const { classCode, classExperimentId, experimentId, className, courseName, experimentName } = experiment

  if (!classCode || !classExperimentId) return

  router.push({
    path: `/teacher/classes/${classCode}/experiments/${classExperimentId}/detail`,
    query: {
      tabbarName: `${experimentName}:${className}` || '班级实验详情',
      experimentId: experimentId?.toString(),
      className: className || '',
      courseName: courseName || '',
      experimentName: experimentName || '',
    },
  })
}
