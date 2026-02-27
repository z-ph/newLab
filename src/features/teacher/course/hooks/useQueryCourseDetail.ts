/**
 * 课程详情相关 Hooks
 */

import { getApiTeacherExperimentsClassExperiments, getApiTeacherExperimentsCourseByCourseId } from '@/core/api/generated'
import type { Ref } from 'vue'
import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询课程下的实验列表
 */
export function useQueryCourseExperimentList(courseId: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ['course-experiments', unref(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsCourseByCourseId({
        path: { courseId: unref(courseId) || '' },
        client,
      }),
    select: (res) => res.data?.data || [],
    enabled: computed(() => !!unref(courseId)),
  })
}

/**
 * 查询课程关联的班级实验列表
 * 通过 courseId 过滤获取该课程下所有班级的实验安排
 */
export function useQueryCourseClassExperiments(courseId: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ['course-class-experiments', unref(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsClassExperiments({
        query: {
          courseId: unref(courseId),
          pageable: false,
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => !!unref(courseId)),
  })
}
