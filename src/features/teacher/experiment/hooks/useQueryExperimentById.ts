import { type Ref, unref, computed } from "vue";
import { getApiTeacherExperimentsByExperimentId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useQueryExperimentById(
  experimentId: Ref<number | undefined>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiment", unref(experimentId)]),
    queryFn: () =>
      getApiTeacherExperimentsByExperimentId({
        path: { experimentId: unref(experimentId)! },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => {
      const id = unref(experimentId)
      const isValidId = id !== undefined && !Number.isNaN(id) && id > 0
      const explicitEnabled = options?.enable ? unref(options.enable) : true
      return isValidId && explicitEnabled
    }),
  });
}
