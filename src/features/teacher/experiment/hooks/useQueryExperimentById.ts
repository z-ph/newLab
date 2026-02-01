import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherExperimentsByExperimentId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useQueryExperimentById(
  experimentId: MaybeRefOrGetter<number>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiment", toValue(experimentId)]),
    queryFn: () =>
      getApiTeacherExperimentsByExperimentId({
        path: { experimentId: toValue(experimentId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
