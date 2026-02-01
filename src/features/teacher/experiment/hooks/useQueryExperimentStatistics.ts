import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询班级实验统计信息
 */
export function useQueryExperimentStatistics(
  classCode: MaybeRefOrGetter<string>,
  experimentId: MaybeRefOrGetter<number>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
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
