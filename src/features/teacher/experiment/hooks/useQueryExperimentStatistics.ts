import { getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 查询班级实验统计信息
 */
export function useQueryExperimentStatistics(
  classCode: string | Ref<string>,
  experimentId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["experiment-statistics", classCode, experimentId],
    queryFn: () =>
      getApiTeacherStudentsClassesByClassCodeExperimentsByExperimentIdStatistics({
        path: {
          classCode: unref(classCode),
          experimentId: unref(experimentId),
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
