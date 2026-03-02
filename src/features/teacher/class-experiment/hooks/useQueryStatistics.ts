/**
 * 班级实验完成统计查询 Hook
 */

import { type Ref, unref, computed } from 'vue'
import { getApiTeacherStudentsClassesClasscodeExperimentsExperimentidStatistics } from '@/core/api/generated'
import type { ClassExperimentStatisticsResponse } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询班级实验学生完成统计
 */
export function useQueryStatistics(
  classCode: Ref<string | undefined>,
  experimentId: Ref<number | undefined>,
  options?: { enable?: Ref<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['class-experiment-statistics', unref(classCode), unref(experimentId)]),
    queryFn: () =>
      getApiTeacherStudentsClassesClasscodeExperimentsExperimentidStatistics({
        path: {
          classCode: unref(classCode)!,
          experimentId: unref(experimentId)!,
        },
        client,
      }),
    select: (res): ClassExperimentStatisticsResponse | undefined => res.data?.data,
    enabled: computed(() => !!unref(options?.enable) && !!unref(classCode) && !!unref(experimentId)),
  })
}

export type StatisticsData = ClassExperimentStatisticsResponse
