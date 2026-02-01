/**
 * 查询签到统计 Hook
 */

import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceCount } from '@/core/api/generated'
import client from '@/core/api/config'

interface UseQueryAttendanceStatisticsParams {
  courseId: MaybeRefOrGetter<string>
  experimentId: MaybeRefOrGetter<string>
  enable?: MaybeRefOrGetter<boolean>
}

export function useQueryAttendanceStatistics({
  courseId,
  experimentId,
  enable,
}: UseQueryAttendanceStatisticsParams) {
  return useQuery({
    queryKey: computed(() => ['teacher', 'attendance', 'statistics', toValue(courseId), toValue(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceCount({
        query: {
          courseId: toValue(courseId),
          experimentId: toValue(experimentId),
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: computed(() => toValue(enable)),
  })
}


