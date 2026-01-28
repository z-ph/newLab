import { getApiTeacherExperimentsByExperimentId } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

export function useQueryExperimentById(
  experimentId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["experiment", experimentId],
    queryFn: () =>
      getApiTeacherExperimentsByExperimentId({
        path: { experimentId: unref(experimentId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
