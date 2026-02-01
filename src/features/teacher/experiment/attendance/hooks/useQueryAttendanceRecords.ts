/**
 * 查询签到记录 Hook
 */

import { type Ref, unref, computed } from 'vue'
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
    queryKey: computed(() => ['teacher', 'attendance', 'records', unref(courseId), unref(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceRecords({
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

