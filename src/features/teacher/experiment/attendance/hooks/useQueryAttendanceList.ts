/**
 * 查询签到列表 Hook
 */

import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceList } from '@/core/api/generated'
import client from '@/core/api/config'
import type { Ref } from 'vue'

interface UseQueryAttendanceListParams {
  classCode: Ref<string>
  experimentId: Ref<string>
  enable?: Ref<boolean>
}

export function useQueryAttendanceList({
  classCode,
  experimentId,
  enable,
}: UseQueryAttendanceListParams) {
  return useQuery({
    queryKey: ['teacher', 'attendance', 'list', classCode, experimentId] as const,
    queryFn: async () => {
      return getApiTeacherAttendanceList({
        query: {
          classId: Number(classCode.value), // 将 classCode 转换为 number
          experimentId: experimentId.value,
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: enable ?? true,
  })
}

