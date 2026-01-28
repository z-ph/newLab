import { getApiTeacherExperiments } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询所有实验
 */
export function useQueryExperimentAll(options?: Partial<QueryOptions>) {
  return useQuery({
    queryKey: options?.queryKey || ["experiments-all"],
    queryFn: () =>
      getApiTeacherExperiments({
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
