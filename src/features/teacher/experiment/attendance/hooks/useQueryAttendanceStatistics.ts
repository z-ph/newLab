/**
 * 查询签到统计 Hook
 */

import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceCount } from '@/core/api/generated'
import type { Ref } from 'vue'

interface UseQueryAttendanceStatisticsParams {
  courseId: Ref<string>
  experimentId: Ref<string>
  enable?: Ref<boolean>
}

export function useQueryAttendanceStatistics({
  courseId,
  experimentId,
  enable,
}: UseQueryAttendanceStatisticsParams) {
  return useQuery({
    queryKey: ['teacher', 'attendance', 'statistics', courseId, experimentId] as const,
    queryFn: async () => {
      return getApiTeacherAttendanceCount({
        query: {
          courseId: courseId.value,
          experimentId: experimentId.value,
        },
      })
    },
    enabled: enable,
  })
}


