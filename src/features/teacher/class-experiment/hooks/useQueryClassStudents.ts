/**
 * 班级学生查询 Hooks
 */

import { postApiTeacherClassByClassCodeStudents } from '@/core/api/generated'
import type { QueryOptions } from '@/features/shared/types/UseQueryOptions'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询班级学生列表
 */
export function useQueryClassStudents(classCode: string, options?: Partial<QueryOptions>) {
  return useQuery({
    queryKey: options?.queryKey || ['class-students', classCode],
    queryFn: () =>
      postApiTeacherClassByClassCodeStudents({
        path: { classCode },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable && !!classCode,
  })
}
