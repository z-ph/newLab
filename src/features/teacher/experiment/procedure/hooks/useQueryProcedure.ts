import { getApiTeacherProceduresByProcedureId, getApiTeacherProceduresExperimentByExperimentId } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 查询指定实验的所有步骤
 */
export function useQueryProceduresByExperiment(
  experimentId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["procedures", "experiment", experimentId],
    queryFn: () =>
      getApiTeacherProceduresExperimentByExperimentId({
        path: { experimentId: unref(experimentId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}

/**
 * 查询单个步骤详情
 */
export function useQueryProcedureById(
  procedureId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["procedure", procedureId],
    queryFn: () =>
      getApiTeacherProceduresByProcedureId({
        path: { procedureId: unref(procedureId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
