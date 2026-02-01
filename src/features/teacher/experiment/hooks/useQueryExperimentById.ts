import { type Ref, unref, computed } from "vue";
import { getApiTeacherExperimentsByExperimentId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useQueryExperimentById(
  experimentId: Ref<number>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiment", unref(experimentId)]),
    queryFn: () =>
      getApiTeacherExperimentsByExperimentId({
        path: { experimentId: unref(experimentId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
