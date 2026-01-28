/**
 * 查询签到列表 Hook
 */

import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceList } from '@/core/api/generated'
import client from '@/core/api/config'
import type { Ref } from 'vue'

interface UseQueryAttendanceListParams {
  classExperimentId: Ref<number>
  enable?: Ref<boolean>
}

export function useQueryAttendanceList({
  classExperimentId,
  enable,
}: UseQueryAttendanceListParams) {
  return useQuery({
    queryKey: ['teacher', 'attendance', 'list', classExperimentId] as const,
    queryFn: async () => {
      return getApiTeacherAttendanceList({
        query: {
          classExperimentId: classExperimentId.value,
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: enable ?? true,
  })
}

