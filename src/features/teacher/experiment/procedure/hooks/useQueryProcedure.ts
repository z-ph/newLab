import { type Ref, unref, computed } from "vue";
import { getApiTeacherProceduresByProcedureId, getApiTeacherProceduresExperimentByExperimentId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询指定实验的所有步骤
 */
export function useQueryProceduresByExperiment(
  experimentId: Ref<number | undefined>,
  options?: { enabled?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["procedures", "experiment", unref(experimentId)]),
    queryFn: () =>
      getApiTeacherProceduresExperimentByExperimentId({
        path: { experimentId: unref(experimentId)! },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => {
      const id = unref(experimentId)
      const isValidId = id !== undefined && !Number.isNaN(id) && id > 0
      const explicitEnabled = options?.enabled ? unref(options.enabled) : true
      return isValidId && explicitEnabled
    }),
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
    queryKey: computed(() => ["procedure", unref(procedureId)]),
    queryFn: () =>
      getApiTeacherProceduresByProcedureId({
        path: { procedureId: unref(procedureId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
