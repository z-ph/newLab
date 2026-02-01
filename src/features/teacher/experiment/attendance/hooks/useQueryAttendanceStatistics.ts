/**
 * 查询签到统计 Hook
 */

import { type Ref, unref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceCount } from '@/core/api/generated'
import client from '@/core/api/config'

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
    queryKey: computed(() => ['teacher', 'attendance', 'statistics', unref(courseId), unref(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceCount({
        query: {
          courseId: unref(courseId),
          experimentId: unref(experimentId),
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: computed(() => unref(enable)),
  })
}


