/**
 * 查询签到列表 Hook
 */

import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherAttendanceList } from '@/core/api/generated'
import client from '@/core/api/config'

interface UseQueryAttendanceListParams {
  classCode: MaybeRefOrGetter<string>
  experimentId: MaybeRefOrGetter<string>
  enable?: MaybeRefOrGetter<boolean>
}

export function useQueryAttendanceList({
  classCode,
  experimentId,
  enable,
}: UseQueryAttendanceListParams) {
  return useQuery({
    queryKey: computed(() => ['teacher', 'attendance', 'list', toValue(classCode), toValue(experimentId)]),
    queryFn: async () => {
      return getApiTeacherAttendanceList({
        query: {
          classId: Number(toValue(classCode)), // 将 classCode 转换为 number
          experimentId: toValue(experimentId),
        },
        client,
      })
    },
    select: (response) => response.data?.data,
    enabled: computed(() => toValue(enable) ?? true),
  })
}

