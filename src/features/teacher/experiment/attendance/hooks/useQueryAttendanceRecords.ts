/**
 * 查询签到记录 Hook
 */

import { type Ref, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceRecords } from '@/core/api/generated'
import client from '@/core/api/config'

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
    queryKey: computed(() => ['teacher', 'attendance', 'records', toValue(courseId), toValue(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceRecords({
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

