import { getApiTeacherExperiments } from "@/core/api/generated";
import type { GetApiParamsTypeBase } from "@/core/utils/typeUtils";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import client from "@/core/api/config";

export default function useQueryExperimentBase(
  queryParams: GetApiParamsTypeBase<typeof getApiTeacherExperiments, "params">,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      getApiTeacherExperiments({
        params: queryParams,
        client,
      }),
    select: (res) => res.data?.data,
  });
}

export function useQueryExperimentAll() {
  const query = useQueryExperimentBase(
    {},
    {
      queryKey: ["experiments-all"],
    },
  );
  return { query };
}

export function useQueryExperimentPage(initial: {
  current?: number;
  size?: number;
}) {
  const current = ref(initial.current || 1);
  const size = ref(initial.size || 20);
  const query = useQueryExperimentBase(
    {
      current: current.value,
      size: size.value,
    },
    {
      queryKey: computed(() => ["experiments-page", current.value, size.value]),
    },
  );
  return {
    current,
    size,
    query,
  };
}
