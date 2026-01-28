/**
 * 查询签到列表 Hook
 */

import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceList } from '@/core/api/generated'
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
      })
    },
    enabled: enable ?? true,
  })
}

