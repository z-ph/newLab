import { type Ref, toValue, computed } from "vue";
import { getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询班级实验统计信息
 */
export function useQueryExperimentStatistics(
  classCode: Ref<string>,
  experimentId: Ref<number>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiment-statistics", toValue(classCode), toValue(experimentId)]),
    queryFn: () =>
      getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics({
        path: {
          classCode: toValue(classCode),
          experimentId: toValue(experimentId),
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
