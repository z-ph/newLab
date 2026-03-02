/**
 * 查询单个班级实验详情的 Hook
 * 从班级实验列表中筛选出指定ID的实验
 */

import { type Ref, unref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getApiTeacherClassCodeClasscode } from '@/core/api/generated'
import client from '@/core/api/config'
import type { ExperimentInfo } from '@/core/api/generated'

export function useQueryClassExperimentDetail(
  classCode: Ref<string>,
  experimentId: Ref<string> | string
) {
  const experimentIdRef = computed(() => {
    return typeof experimentId === 'string' ? experimentId : unref(experimentId)
  })

  return useQuery({
    queryKey: computed(() => ['class-experiment-detail', unref(classCode), experimentIdRef.value]),
    queryFn: async () => {
      const response = await getApiTeacherClassCodeClasscode({
        path: { classCode: unref(classCode)! },
        client,
      })

      const experiments = response.data?.data?.experiments || []
      const experiment = experiments.find(
        (exp: ExperimentInfo) => String(exp.experimentId) === experimentIdRef.value
      )

      return experiment || null
    },
    enabled: computed(() => !!unref(classCode) && !!experimentIdRef.value),
  })
}
