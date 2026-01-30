/**
 * 学生步骤提交查询 Hooks
 */

import { getApiTeacherProcedureSubmissionsCourseByCourseId } from '@/core/api/generated'
import type { QueryOptions } from '@/features/shared/types/UseQueryOptions'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询课程下所有学生的步骤提交
 */
export function useQueryStudentSubmissions(
  courseId: string,
  options?: Partial<QueryOptions>
) {
  return useQuery({
    queryKey: options?.queryKey || ['student-submissions', courseId],
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId },
        client,
      }),
    select: (res) => res.data?.data || [],
    enabled: options?.enable && !!courseId,
  })
}
