import { type Ref, toValue, computed } from "vue";
import { getApiTeacherProceduresByProcedureId, getApiTeacherProceduresExperimentByExperimentId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询指定实验的所有步骤
 */
export function useQueryProceduresByExperiment(
  experimentId: Ref<number>,
) {
  return useQuery({
    queryKey: computed(() => ["procedures", "experiment", toValue(experimentId)]),
    queryFn: () =>
      getApiTeacherProceduresExperimentByExperimentId({
        path: { experimentId: toValue(experimentId) },
        client,
      }),
    select: (res) => res.data?.data,
  });
}

/**
 * 查询单个步骤详情
 */
export function useQueryProcedureById(
  procedureId: Ref<number>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["procedure", toValue(procedureId)]),
    queryFn: () =>
      getApiTeacherProceduresByProcedureId({
        path: { procedureId: toValue(procedureId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
