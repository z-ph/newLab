import { type Ref, unref, computed } from "vue";
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
    queryKey: computed(() => ["experiment-statistics", unref(classCode), unref(experimentId)]),
    queryFn: () =>
      getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics({
        path: {
          classCode: unref(classCode),
          experimentId: unref(experimentId),
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
