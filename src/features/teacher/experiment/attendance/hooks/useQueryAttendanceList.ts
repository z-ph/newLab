/**
 * 查询签到列表 Hook
 */

import { type Ref, unref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceList } from '@/core/api/generated'
import client from '@/core/api/config'

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
    queryKey: computed(() => ['teacher', 'attendance', 'list', unref(classCode), unref(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceList({
        query: {
          classCode: (unref(classCode)), // 将 classCode 转换为 number
          experimentId: unref(experimentId),
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: computed(() => unref(enable) ?? true),
  })
}

