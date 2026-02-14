import { type Ref, unref, computed } from 'vue'
import { getApiStudentExperimentsByExperimentId } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import type { StudentExperimentDetailResponse } from '@/core/api/generated'

/**
 * 查询学生实验详情（包含实验步骤）
 */
export function useQueryStudentExperimentDetail(
  experimentId: Ref<number>,
  classCode: Ref<string>
) {
  const query = useQuery({
    queryKey: computed(() => ['student-experiment-detail', unref(experimentId), unref(classCode)]),
    queryFn: () =>
      getApiStudentExperimentsByExperimentId({
        path: { experimentId: unref(experimentId) },
        query: { classCode: unref(classCode) },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(() => !!unref(experimentId) && !!unref(classCode)),
  })

  return {
    experimentDetail: query.data as Ref<StudentExperimentDetailResponse | undefined>,
    query,
  }
}
