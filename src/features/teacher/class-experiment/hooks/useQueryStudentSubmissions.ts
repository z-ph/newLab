/**
 * 学生步骤提交查询 Hooks
 */

import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { getApiTeacherProcedureSubmissionsCourseByCourseId } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询课程下所有学生的步骤提交
 */
export function useQueryStudentSubmissions(
  courseId: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['student-submissions', toValue(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data || [],
    enabled: computed(() => toValue(options?.enable) && !!toValue(courseId)),
  })
}
