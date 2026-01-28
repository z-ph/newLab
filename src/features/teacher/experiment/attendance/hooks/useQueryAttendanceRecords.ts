/**
 * 查询签到记录 Hook
 */

import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceRecords } from '@/core/api/generated'
import type { Ref } from 'vue'

interface UseQueryAttendanceRecordsParams {
  courseId: Ref<string>
  experimentId: Ref<string>
  enable?: Ref<boolean>
}

export function useQueryAttendanceRecords({
  courseId,
  experimentId,
  enable,
}: UseQueryAttendanceRecordsParams) {
  return useQuery({
    queryKey: ['teacher', 'attendance', 'records', courseId, experimentId] as const,
    queryFn: async () => {
      return getApiTeacherAttendanceRecords({
        query: {
          courseId: courseId.value,
          experimentId: experimentId.value,
        },
      })
    },
    enabled: enable,
  })
}

